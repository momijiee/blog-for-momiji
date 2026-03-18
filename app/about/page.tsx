import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-semibold">About</h1>
      
      <div className="space-y-8">
        {/* 个人概况 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">个人概况</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <ul className="list-disc list-inside space-y-2">
              <li>06年生，广东深圳长大</li>
              <li>INTJ</li>
              <li>计算机专业大二，正在为了本科就业而努力</li>
              <li>热爱各种非对抗性运动，跑步、游泳、骑行、徒步，攀岩滑雪（等以后有钱了）</li>
              <li>有点nerd，喜欢读各种杂书，理解这个世界的底层原理</li>
              <li>沉迷于思考，通过思考认识自己</li>
            </ul>
          </CardContent>
        </Card>

        {/* 关于博客 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">关于博客</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>这里是我的一些碎碎念，暂时没有发在社交媒体上的打算，所以恭喜你看到了全网独一份的内容hhh。</p>
            <ul className="list-disc list-inside space-y-2">
              <li>生活随笔：生活，思考</li>
              <li>技术笔记：CS学习</li>
            </ul>
          </CardContent>
        </Card>

        {/* 关于本站 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">关于本站</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <ul className="list-disc list-inside space-y-2">
              <li>基于next.js 16全栈，App Router</li>
              <li>评论区和统计通过Supabase实现</li>
            </ul>
          </CardContent>
        </Card>

        {/* 联系方式 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">联系方式</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>momijih1019@gmail.com</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
