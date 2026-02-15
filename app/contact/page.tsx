import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-semibold">Contact Me</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">联系方式</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground text-lg">
          
          邮箱：2019290185@qq.com
          <br/>
          <br/>
          很期待和您一起交流对这个世界的奇思妙想。

        </CardContent>
      </Card>
    </div>
  );
}
