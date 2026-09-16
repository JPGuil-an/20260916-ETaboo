<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'birthday' => $this->birthday,
            'mobile_number' => $this->mobile_number,
            'email' => $this->email,
            'address' => $this->address,
            'is_verified' => $this->is_verified,
            'is_active' => $this->is_active,
            'user_type' => $this->user_type,
            'id_pic' => $this->id_pic,
        ];
    }
}
