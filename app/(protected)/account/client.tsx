"use client"

import { PageBreadcrumbs } from "@/components/app-shell";
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

const breadcrumbs = [
    { label: "Account" },
];

export default function Client() {
    return (
        <>
            <PageBreadcrumbs breadcrumbs={breadcrumbs} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold block sm:hidden">Account</h1>

                {/*TODO: Implement*/}
                <form>
                    <FieldGroup className="mb-6">
                        <Field>
                            <FieldLabel htmlFor="name">Name</FieldLabel>
                            <Input
                                id="name"
                                placeholder="Your name"
                                type="text"
                                required
                                className="rounded-md h-9 px-3"
                            />
                            <FieldDescription>
                                This is the name that will be displayed on your profile and in emails.
                            </FieldDescription>
                        </Field>
                    </FieldGroup>

                    <FieldGroup className="mb-6">
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                placeholder="Your email"
                                type="email"
                                required
                                className="rounded-md h-9 px-3"
                            />
                            <FieldDescription>
                                This is the email you use to sign in.
                            </FieldDescription>
                        </Field>
                    </FieldGroup>

                    <Button className="rounded-md h-9 px-4 py-2" type="submit">Update profile</Button>
                </form>
            </div>
        </>
    );
}
