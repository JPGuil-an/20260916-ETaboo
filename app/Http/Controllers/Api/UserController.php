<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Product;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Requests\StoreUserRequest;
use App\Http\Resources\ProductResource;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    // public function index()
    // {
    //     return UserResource::collection(User::query()->orderBy('id', 'desc')->paginate(10));
    // }
    //  public function index()
    // {
    //     return UserResource::collection(User::query()->orderBy('id', 'asc')->paginate(5));
    // }
    public function allUsersPending()
    {
        $user =User::where('is_verified', '=' , 0)->paginate(10);
        return UserResource::collection($user);
    }

    public function allUsers(Request $request)
    {
        $query = User::query()->where('user_type', '!=', 3);

        if ($request->filled('status')) {
            match ($request->string('status')->toString()) {
                'verified' => $query->where('is_verified', 1),
                'pending' => $query->where('is_verified', 0),
                'active' => $query->where('is_active', 1),
                'inactive' => $query->where(function ($builder) {
                    $builder->where('is_active', 0)->orWhereNull('is_active');
                }),
                default => null,
            };
        }

        if ($request->filled('role') && in_array((int) $request->role, [0, 1, 2], true)) {
            $query->where('user_type', (int) $request->role);
        }

        if ($request->filled('search')) {
            $term = '%' . trim($request->search) . '%';
            $query->where(function ($builder) use ($term) {
                $builder->where('name', 'like', $term)
                    ->orWhere('mobile_number', 'like', $term)
                    ->orWhere('email', 'like', $term)
                    ->orWhere('address', 'like', $term);
            });
        }

        return UserResource::collection($query->orderByDesc('updated_at')->paginate(12)->withQueryString());
    }



    public function usercount()
    {
        $userAll =User::all()->count();
        // return response()->json(['allUser' => $allUser]);

        $pendingUser =User::where('user_type', '0')->count();
        return response()->json([
            'userAll' => $userAll,
            'pendingUser' => $pendingUser,

        ]);


    }


    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\StoreUserRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $data['password'] = bcrypt($data['password']);
        $user = User::create($data);

        return response(new UserResource($user) , 201);
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\UpdateUserRequest $request
     * @param \App\Models\User                     $user
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();
        // if (isset($data['password'])) {
        //     $data['password'] = bcrypt($data['password']);
        // }
        $data['is_verified'] = 1;
        $data['updated_at'] = date('Y/m/d H:i:s');
        $user->update($data);

        return new UserResource($user);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        $user->delete();
        return response("", 204);
    }

}
