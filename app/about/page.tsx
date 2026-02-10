import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-semibold">About Me</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Momiji</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground text-lg">


          你好，我是一名生活在AI时代里的普通个体。
          <br />
          <br />
          目前在南方的一所985学习计算机。
          但技术并不是我理解世界的唯一方式。
          比起“掌握了什么”，我更在意一个人如何形成他的价值观、判断力与生活方式。
          <br />
          <br />
          我成长于一个高度功绩化的环境，也曾认真地投入其中；
          后来经历过对竞争、成功与自我价值的怀疑、反思与重建。
          现在的我，既不逃避现实世界的规则，
          也不愿完全被它们定义——更关心如何在不自我异化的前提下持续行动、展开生活。
          <br />
          <br />
          我对许多问题保持长期兴趣：
          个体在下行周期中的处境、人生的意义和人的主体性、亲密关系的结构、努力与运气的边界，
          原生家庭的创伤、自我成长。
          <br />
          <br />
          通过徒步、健身、跑步，学习人文社科和自然科学杂七杂八的知识，
          追剧、追动漫，看电影、话剧，
          solotrip、散步、发呆、胡思乱想，这些抽象的问题又落回到了具体生活。
          <br />
          <br />
          这个博客并不试图给出答案。
          它更像是一份持续更新的自我记录：
          记录思考如何发生，选择如何形成，生活如何被一点点塑造。
          <br />
          <br />
          如果这些内容对你有共鸣，欢迎停留。

        </CardContent>
      </Card>
    </div>
  );
}
