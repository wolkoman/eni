import Responsive from "./Responsive";
import Site from "./Site";
import React, {ReactNode} from "react";

export const Article = (props: { image?: string, title: string, created?: number, author?: string, children: ReactNode }) => {
    return <Site responsive={false} title={props.title} >
        <div className={`relative ${props.image ? '' : ''}`}>
            {props.image && <div className="overflow-hidden absolute w-full h-full inset-0"><div className="blur-lg scale-125 absolute w-full h-full inset-0">
                <div className="absolute w-full h-full inset-0 overflow-hidden"
                     style={{
                         backgroundImage: `url(${props.image})`,
                         backgroundPosition: 'center center',
                         backgroundSize: 'cover',
                         filter: ' brightness(0.7) contrast(0.8)'
                     }}/>
            </div></div>}
            <div className="relative z-10">
                <Responsive>
                    <div className="flex flex-col-reverse md:flex-row my-4">
                        <div className="flex-shrink-0 ml-4">
                            <img src={`${props.image}`}
                                 className={`h-52 max-w-full mr-4 rounded-lg relative top-8 ${props.image || 'opacity-0 hidden'}`}
                                 alt="article-preview"/>
                        </div>
                        <div className="flex flex-col mt-12 mb-6 text-white">
                            <div className="text-5xl font-bold">{props.title}</div>
                            <div className="flex">
                                {props.created && <div
                                    className="mt-3 italic pt-2 mr-2">am {new Date((props.created ?? 0) * 1000).toLocaleDateString("de-AT")}</div>}
                                {props.author && <div className="mt-3 italic pt-2">von {props.author}</div>}
                            </div>
                        </div>
                    </div>
                </Responsive>
            </div>
        </div>
        <Responsive>
            <div className="text-lg font-serif mt-12">
                {props.children}
            </div>
        </Responsive>
    </Site>
}