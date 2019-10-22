import React, { useState } from 'react'
import {
    Card,
    StyledBody,
    StyledAction
} from "baseui/card";
import { styled } from 'baseui'
import { Button } from "baseui/button";
import { Input } from "baseui/input";

const WidthWrapper = styled('div', {
    width: "33vw"
});


export default function Auth() {
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")

    return (
        <WidthWrapper>
            <Card title="Authenticate">
                <StyledBody>
                    <Input
                        // value={userName}
                        onChange={e => setUserName((e.target as HTMLInputElement).value)}
                        placeholder="Username"
                    />
                    <div style={{height:"1em"}}/>
                    <Input
                        type="password"
                        value={password}
                        onChange={e => setPassword((e.target as HTMLInputElement).value)}
                        placeholder="Password"
                    />
                </StyledBody>
                <StyledAction>
                    <Button overrides={{ BaseButton: { style: { width: "100%" } } }}>
                        Login
                    </Button>
                </StyledAction>
            </Card>
        </WidthWrapper>
    )
}
