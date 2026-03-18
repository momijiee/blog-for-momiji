"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const cardVariants = {
    hover: { y: -6 },
    tap: { scale: 0.98 }
}

export function AnimatedAboutCard() {
    return(
        <Link href="/about">
            <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  transition={{ type: "spring", stiffness: 300, damping: 30}}
            >
              <Card className="
                overflow-hidden rounded-xl inline-block w-full
                transition-shadow shadow-md
                hover:shadow-xl
                dark:ring-1 ring-white/10
                dark:hover:ring-white/30
                cursor-pointer
              ">
                <CardHeader>
                  <CardTitle className="text-xl">From Momiji：</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground text-lg">

                  你好，我是Momiji，很高兴在这里见到你。
                  <br />
                  <br />
                  如果内容对你有共鸣，欢迎停留。

                </CardContent>
              </Card>
            </motion.div>
        </Link>
    )
}
