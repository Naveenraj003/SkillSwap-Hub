import React from "react";

const CTA: React.FC = () => {
  return (
    <section className="w-full bg-linear-to-r from-indigo-600 to-purple-600">
      <div className="max-w-4xl mx-auto px-6 text-center text-white">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
          Ready to Start Your Learning Journey?
        </h2>
        <p className="mt-4 text-sm sm:text-base text-indigo-100/90 max-w-2xl mx-auto">
          Join SkillSwap Hub and connect with people who want to teach, learn,
          and exchange knowledge.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-indigo-600 font-semibold shadow-md hover:shadow-lg transition-shadow duration-150 w-full sm:w-auto"
          >
            Join Now
          </button>

          <button
            type="button"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-white text-white font-semibold bg-white/10 hover:bg-white/20 transition-colors duration-150 w-full sm:w-auto"
          >
            Explore Skills
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
