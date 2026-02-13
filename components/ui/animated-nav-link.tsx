"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import Link from "next/link"
import { ReactNode } from "react"

interface AnimatedNavLinkProps {
    href: string
    children: ReactNode
    className?: string
}

export function AnimatedNavLink({ href, children, className }: AnimatedNavLinkProps) {
    return (
        <Link href={href} passHref>
            <motion.div
                className={cn("relative font-medium inline-block", className)}
                whileHover="hover"
                whileTap="tap"
                initial="rest"
                animate="rest"
            >
                <motion.span
                    className="relative z-10 inline-block"
                    variants={{
                        rest: { scale: 1 },
                        hover: { scale: 1.1 },
                        tap: { scale: 0.95 },
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    {children}
                </motion.span>

                <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-current rounded-full"
                    variants={{
                        rest: { width: 0 },
                        hover: { width: "100%" },
                    }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                />
            </motion.div>
        </Link>
    )
}