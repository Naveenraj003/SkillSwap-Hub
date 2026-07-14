import { Link } from 'react-router-dom';

export default function Hero() {
	return (
		<section className="w-full bg-white py-16 sm:py-20 lg:py-24">
			<div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 sm:px-6 lg:flex-row lg:px-8">
				<div className="flex-1 text-center lg:text-left">
					<h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
						Learn Skills. Share Knowledge. Grow Together.
					</h1>

					<p className="mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
						Exchange knowledge with skilled peers. 
						Teach what you know, learn what you need, and grow together through meaningful connections.
					</p>

					<div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
						<Link
							to="/get-started"
							className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
						>
							Get Started
						</Link>

						<Link
							to="/skills"
							className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
						>
							Browse Skills
						</Link>
					</div>
				</div>

				<div className="flex w-full flex-1 items-center justify-center">
					<div className="flex min-h-60 w-full max-w-xl items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center text-lg font-medium text-gray-500 sm:min-h-80 lg:min-h-105">
						Hero Illustration
					</div>
				</div>
			</div>
		</section>
	);
}
