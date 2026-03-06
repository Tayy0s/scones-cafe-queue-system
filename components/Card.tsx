"use client";

import React from "react";



export default function Card({
    title, description, imageUrl, queueCount = 0, children,
}: {
    title: string,
    description?: string,
    imageUrl: string,
    queueCount?: number,
    children?: React.ReactNode
}) {
    return (
        <div>
            <div className="h-108 w-80 mb-4 duration-150 ease-in-out hover:scale-101 brightness-90 hover:brightness-100 group">
                
                <div className="w-full h-full flex flex-col gap-2 overflow-hidden relative rounded-2xl outline-2 outline-slate-700 hover:outline-gray-400 duration-300 bg-black">
                    <div className="relative">
                        <img className="w-full blur-2xl contrast-200 brightness-50" src={imageUrl}/>
                        <img className="w-full absolute top-0 inset-x-0 blur-3xl contrast-250 brightness-70" src={imageUrl}/>
                        <img className="w-full absolute top-0 inset-x-0 bottomblur" src={imageUrl}/>
                        <h1 className="z-100 absolute text-white font-bold text-2xl w-full px-4 bottom-0 left-0">
                            {title}
                        </h1>
                    </div>
                    <div className="grow bg-black overflow-hidden flex flex-col">
                        <p className="z-100 text-gray-100 px-4 w-full">
                            {description}
                        </p>
                    </div>
                    <span className="text-center w-full mb-2 text-gray-500">
                        {queueCount} people in Queue
                    </span>
                </div>
            </div>
        </div>
    )
}
