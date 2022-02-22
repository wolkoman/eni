import React from 'react';

export const Info = ({title, image, children}: { title: string, image: string, children: any }) => {
    return <div className="p-6 text-lg mb-8 bg-white shadow rounded-lg">
        <div className="flex flex-col md:flex-row md:items-end mb-2">
            <img src={image} className="w-16"/>
            <div className="text-3xl ml-2 font-bold">{title}</div>
        </div>
        {children}
    </div>
}