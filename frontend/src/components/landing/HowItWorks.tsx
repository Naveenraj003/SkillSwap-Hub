const steps = [
  { number: 1, title: 'Create Your Profile', desc: 'Build your profile and showcase your skills.' },
  { number: 2, title: 'Add Skills You Teach', desc: 'List skills you can share with others.' },
  { number: 3, title: 'Match With Skill Partners', desc: 'Find people who want to learn or exchange skills.' },
  { number: 4, title: 'Book Live Sessions', desc: 'Schedule learning sessions after mutual approval.' },
]

export default function HowItWorks() {
  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center">How SkillSwap Works</h2>

        <p className="mt-4 text-center text-gray-600 max-w-2xl mx-auto">
          Learn, teach and connect with others—quickly find partners and book live sessions.
        </p>

        <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 flex flex-col items-start"
            >
              <div className="flex items-center gap-4 w-full">
                <div className="shrink-0">
                  <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
              </div>

              {step.desc ? (
                <p className="mt-4 text-gray-600 text-sm">{step.desc}</p>
              ) : null}

            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
