/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GrantedAuthority } from './GrantedAuthority';
import type { Purchase } from './Purchase';
import type { Role } from './Role';
import type { VerificationCode } from './VerificationCode';
export type User = {
    userId?: number;
    email?: string;
    password?: string;
    name?: string;
    phone?: string;
    address?: string;
    isDeleted?: boolean;
    enabled?: boolean;
    purchases?: Array<Purchase>;
    verificationCode?: VerificationCode;
    roles?: Array<Role>;
    username?: string;
    verified?: boolean;
    authorities?: Array<GrantedAuthority>;
    accountNonExpired?: boolean;
    accountNonLocked?: boolean;
    credentialsNonExpired?: boolean;
    roleIds?: Array<number>;
};

