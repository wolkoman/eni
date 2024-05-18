"use client"

import {useState} from "@/app/(shared)/use-state-util";
import {useUserStore} from "@/store/UserStore";
import {Permission} from "@/domain/users/Permission";
import Button from "../../components/Button";
import {PiPlusBold} from "react-icons/pi";
import {EventEdit, EventEditBackground} from "../../components/calendar/EventEdit";
import React from "react";

export function AddEvent() {
    const [isEditing, setIsEditing] = useState(false);
    const user = useUserStore(state => state.user);
    return user?.permissions[Permission.PrivateCalendarAccess] ? <>
        <div className={`static lg:relative`}>
            <Button
                label={<div className="flex gap-1 items-center"><PiPlusBold/> Terminvorschlag</div>}
                onClick={() => setIsEditing(true)}
            />
            {isEditing && <EventEdit
                onClose={() => setIsEditing(false)} parish={user.parish}
                suggestion={{date: "", time: "", description: "", summary: ""}}
            />}
        </div>
        {isEditing && <EventEditBackground onClick={() => setIsEditing(false)}/>}
    </> : <></>;
}