import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Footer() {
	return (
		<footer className="border-t border-slate-200 bg-white text-slate-700">
			<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
				<div className="grid gap-10 md:grid-cols-3 md:items-start">
					<div>
						<h2 className="text-xl font-semibold text-slate-900">SkillSwap Hub</h2>
						<p className="mt-3 text-sm text-slate-600">Learn. Share. Grow.</p>
					</div>

					<nav aria-label="Quick Links" className="space-y-4 md:text-center">
						<h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
							Quick Links
						</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<a href="home" className="transition-colors hover:text-slate-900">
									Home
								</a>
							</li>
							<li>
								<a href="how-it-works" className="transition-colors hover:text-slate-900">
									How It Works
								</a>
							</li>
							<li>
								<a href="login" className="transition-colors hover:text-slate-900">
									Login
								</a>
							</li>
						</ul>
					</nav>

					<div className="md:text-right">
						<h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
							Social
						</h3>
						<div className="mt-4 flex items-center gap-4 md:justify-end">
							<a
								href="https://github.com"
								aria-label="Github"
								className="rounded-full p-2 transition-colors hover:bg-slate-100 hover:text-slate-900"
							>
								<FaGithub className="h-5 w-5" />
							</a>
							<a
								href="https://linkedin.com"
								aria-label="LinkedIn"
								className="rounded-full p-2 transition-colors hover:bg-slate-100 hover:text-slate-900"
							>
								<FaLinkedin className="h-5 w-5" />
							</a>
							<a
								href="mailto:hello@skillswaphub.com"
								aria-label="Mail"
								className="rounded-full p-2 transition-colors hover:bg-slate-100 hover:text-slate-900"
							>
								<MdEmail className="h-5 w-5" />
							</a>
						</div>
					</div>
				</div>

				<div className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
					© 2026 SkillSwap Hub. All rights reserved.
				</div>
			</div>
		</footer>
	);
}
