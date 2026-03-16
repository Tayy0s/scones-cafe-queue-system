"use client"
import { useState, Dispatch, SetStateAction } from "react";

export default function Modal({ state, actionText, callback } : { state: [boolean, Dispatch<SetStateAction<boolean>>], actionText: string, callback: () => void }) {
    const [ shown, setShown ] = state;
    const dismiss = () => setShown(false);

    return shown && (
        <div className="fixed inset-0 min-w-dvw min-h-dvh backdrop-brightness-50 backdrop-blur flex items-center p-4" onClick={dismiss}>
            <div className="grow bg-zinc-950 outline outline-zinc-900 rounded-2xl p-4 max-w-xl mx-auto my-auto">
                <h1 className="text-2xl text-centered mb-4">Are you sure you want to {actionText}?</h1>
                <div className="flex justify-center">
                    <div className="grow flex gap-2 mt-8 max-w-100">
                        <button className="grow px-8 py-2 rounded-xl outline outline-zinc-800 bg-green-500/30 hover:bg-green-500/35 ease-in-out" onClick={() => { dismiss(); callback(); }}>Confirm</button>
                        <button className="grow px-8 py-2 rounded-xl outline outline-zinc-800 bg-red-500/30 hover:bg-red-500/35 ease-in-out" onClick={dismiss}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}