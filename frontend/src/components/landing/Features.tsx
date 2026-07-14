import { BookOpen, Users, Video, Star, Sparkles, Shield } from "lucide-react";

const features = [
  {
    title: "Learn Skills",
    description:
      "Discover practical skills from peers and grow through knowledge exchange.",
    icon: BookOpen,
  },
  {
    title: "Teach Skills",
    description: "Share your expertise and help others learn valuable skills.",
    icon: Users,
  },
  {
    title: "Live Sessions",
    description: "Connect through approved live learning sessions.",
    icon: Video,
  },
  {
    title: "Skill Ratings",
    description: "Show your expertise through skill ratings and reviews.",
    icon: Star,
  },
  {
    title: "Smart Matching",
    description:
      "Find suitable learning partners based on skills and interests.",
    icon: Sparkles,
  },
  {
    title: "Secure Connections",
    description: "Connect safely without exposing personal contact details.",
    icon: Shield,
  },
];

export default function Features() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Why Choose SkillSwap Hub?
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-xl bg-indigo-50 p-3 text-indigo-600 transition-colors group-hover:bg-indigo-100">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
