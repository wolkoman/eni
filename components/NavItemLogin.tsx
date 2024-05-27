"use client"
import {useUserStore} from "@/store/UserStore";
import {Links} from "@/app/(shared)/Links";
import React from "react";
import {NavItem} from "./NavItem";

export function NavItemLogin() {
    const user = useUserStore(state => state.user);
    return <NavItem href={user ? Links.Intern : Links.Login} label={user ? 'Intern' : 'Login'}/>;
}