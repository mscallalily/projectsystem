<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Role;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        // Normalize the plate before validating so "abc-123" and "ABC-123" count as the same.
        $request->merge(['plate_number' => strtoupper(trim((string) $request->input('plate_number')))]);

        $data = $request->validate([
            'full_name'      => ['required', 'string', 'max:200', 'regex:/\S+\s+\S+/'],
            'user_code'      => ['required', 'string', 'max:50', 'unique:users,user_code'],
            'email'          => ['required', 'email', 'max:255', 'unique:users,email'],
            'password'       => ['required', 'string', 'min:8', 'confirmed'],
            'user_type'      => ['required', Rule::in(['student', 'faculty', 'employee', 'other'])],
            'department'     => ['required', 'exists:departments,department_name'],
            'contact_number' => ['required', 'string', 'max:30'],
            'vehicle_type'   => ['required', 'exists:vehicle_types,type_name'],
            'plate_number'   => ['required', 'string', 'max:20', 'unique:vehicles,plate_number'],
            'make'           => ['nullable', 'string', 'max:100'],
            'model'          => ['nullable', 'string', 'max:100'],
            'color'          => ['nullable', 'string', 'max:50'],
        ]);

        // "Juan dela Cruz" -> first_name "Juan dela", last_name "Cruz"
        $parts = preg_split('/\s+/', trim($data['full_name']));
        $last = array_pop($parts);
        $first = implode(' ', $parts);

        $user = DB::transaction(function () use ($data, $first, $last) {
            $department = Department::where('department_name', $data['department'])->firstOrFail();
            $type = VehicleType::where('type_name', $data['vehicle_type'])->firstOrFail();

            $user = User::create([
                'user_code'      => $data['user_code'],
                'email'          => $data['email'],
                'password'       => $data['password'],
                'user_type'      => $data['user_type'],
                'account_status' => 'pending',
            ]);

            $user->profile()->create([
                'department_id'  => $department->department_id,
                'first_name'     => $first,
                'last_name'      => $last,
                'contact_number' => $data['contact_number'],
            ]);

            // student / faculty / employee get a matching role. "other" gets none until an admin assigns one.
            $role = Role::where('role_code', $data['user_type'])->first();
            if ($role) {
                $user->roles()->attach($role->role_id);
            }

            $vehicle = Vehicle::create([
                'owner_user_id'   => $user->user_id,
                'vehicle_type_id' => $type->vehicle_type_id,
                'plate_number'    => $data['plate_number'],
                'make'            => $data['make'] ?? null,
                'model'           => $data['model'] ?? null,
                'color'           => $data['color'] ?? null,
            ]);

            $vehicle->authorizations()->create(['authorization_status' => 'pending']);

            return $user;
        });

        return response()->json([
            'message' => 'Registration submitted. Your account is pending approval.',
            'user'    => $this->userPayload($user),
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'identifier' => ['required', 'string'],
            'password'   => ['required', 'string'],
        ]);

        $user = User::where('email', $data['identifier'])
            ->orWhere('user_code', $data['identifier'])
            ->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            $this->logAttempt($request, $user, $data['identifier'], false, 'invalid_credentials');
            return response()->json(['message' => 'Invalid email/ID number or password.'], 401);
        }

        if ($user->account_status !== 'active') {
            $this->logAttempt($request, $user, $data['identifier'], false, 'account_' . $user->account_status);
            $messages = [
                'pending'     => 'Your account is still pending approval by the PASS administrator.',
                'suspended'   => 'Your account is suspended. Please contact the PASS office.',
                'deactivated' => 'Your account is deactivated. Please contact the PASS office.',
            ];
            return response()->json(['message' => $messages[$user->account_status] ?? 'Account not active.'], 403);
        }

        $this->logAttempt($request, $user, $data['identifier'], true);
        $user->forceFill(['last_login_at' => now()])->save();

        return response()->json([
            'token' => $user->createToken('web')->plainTextToken,
            'user'  => $this->userPayload($user),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $this->userPayload($request->user())]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out.']);
    }

    /** Same shape as AuthUser in src/context/AuthContext.tsx */
    private function userPayload(User $user): array
    {
        $user->loadMissing('profile.department', 'roles');
        $p = $user->profile;

        return [
            'id'     => (string) $user->user_id,
            'name'   => trim(($p->first_name ?? '') . ' ' . ($p->last_name ?? '')),
            'email'  => $user->email,
            'role'   => $user->roles->first()?->role_code,
            'idNum'  => $user->user_code,
            'dept'   => $p?->department?->department_name,
        ];
    }

    private function logAttempt(Request $request, ?User $user, string $identifier, bool $success, ?string $reason = null): void
    {
        DB::table('login_attempts')->insert([
            'user_id'        => $user?->user_id,
            'identifier'     => $identifier,
            'ip_address'     => $request->ip(),
            'user_agent'     => substr((string) $request->userAgent(), 0, 255),
            'was_successful' => $success,
            'failure_reason' => $reason,
            'attempted_at'   => now(),
        ]);
    }
}