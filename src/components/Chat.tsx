'use client'

import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { Message, useChat } from "ai/react";
import useTheme from "@/hooks/theme";
import { Sun, Moon } from 'lucide-react';
import { FormEvent, useEffect, useState } from "react";
import { v4 } from "uuid";
import cx from 'classnames'

export function Chat() {
    const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
        api: '/api/chat'
    })
    const { theme, toggleTheme } = useTheme();

    const [customMessages, setCustomMessages] = useState<Message[]>([]);

    function sendMessage(event: FormEvent<HTMLFormElement>) {
        setCustomMessages([
            ...customMessages,
            {
                id: v4(),
                role: 'user',
                content: input,
            }
        ]);
        handleSubmit(event);
    }

    function handleError(error: Error) {
        const errorObject = JSON.parse(error.message).error;

        setCustomMessages([
            ...customMessages,
            {
                id: v4(),
                role: 'assistant',
                content: errorObject.message || 'Something went wrong.',
            }
        ]);
    }

    useEffect(() => {
        if(error) handleError(error);
    }, [error])
    
    return (
      <Card className="w-[700px] h-[800px] max-h-[calc(100vh-20px)] max-w-[calc(100vw-20px)] grid grid-rows-[min-content_1fr_min-content]">
        <CardHeader>
            <div className="flex">
                <div className="flex-1">
                    <CardTitle>Chat AI</CardTitle>
                    <CardDescription>Using Vercel SDK to create a chat bot.</CardDescription>
                </div>
                <Button onClick={toggleTheme} className="w-10 h-10 p-0">{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 overflow-scroll">
          {customMessages.map(message => {
            const isUser = message.role === 'user'
            const isAssistant = message.role === 'assistant'
            const isError = error && message.role === 'assistant'

            return (
                <div key={message.id} className="flex items-start gap-3 text-slate-600 text-sm">
                    {isUser && (
                        <Link href="https://github.com/MarceloDCastro" target="_blank">
                            <Avatar>
                                <AvatarFallback>MC</AvatarFallback>
                                <AvatarImage src="https://github.com/MarceloDCastro.png" />
                            </Avatar>
                        </Link>
                    )}
                    {isAssistant && (
                        <Avatar>
                            <AvatarFallback>AI</AvatarFallback>
                            <AvatarImage />
                        </Avatar>
                    )}
                    <p className={
                        cx(
                            "leading-relaxed",
                            isError ? "text-red-500" : "dark:text-slate-400"
                        )
                    }>
                        <span className="block font-bold text-slate-800 dark:text-slate-200">{isUser ? 'User' : 'AI'}:</span>
                        {message.content}
                    </p>
                </div>
            )
          })}
        </CardContent>

        <CardFooter className="flex-col items-start">
            {isLoading && <p className="ml-3">AI is typing...</p>}
            <form
                className="w-full flex gap-2"
                onSubmit={sendMessage}>
                <Input placeholder="How can I help you?" value={input} onChange={handleInputChange} />
                <Button type='submit'>Send</Button>
            </form>
        </CardFooter>
      </Card>
    )
}