import { ArrowLeft } from 'lucide-react';
import jubeeLogoImage from '@/assets/jubee-logo-auth.png';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-[#0A0E1A] flex items-start justify-center p-4 py-12">
      <div className="w-full max-w-[900px] flex flex-col items-center">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="max-h-14 w-auto flex items-center justify-center">
            <img src={jubeeLogoImage} alt="Jubee Logo" className="max-h-10 w-auto object-contain" />
          </div>
        </div>

        {/* Content Card */}
        <div className="w-full bg-[#0F172A] border border-[rgba(148,163,184,0.15)] rounded-2xl p-8">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#94A3B8] hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-white text-3xl font-semibold mb-2">
              Privacy Policy
            </h1>
            <p className="text-[#94A3B8] text-sm">
              Last updated: February 5, 2026
            </p>
          </div>

          {/* Body Content */}
          <div className="space-y-6 text-[#94A3B8] text-sm leading-relaxed">
            <section>
              <h2 className="text-white text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
              <p className="mt-3">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p>
                Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
                <li>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet</li>
                <li>Consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt</li>
                <li>Ut labore et dolore magnam aliquam quaerat voluptatem</li>
                <li>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-3">3. Data Security</h2>
              <p>
                Laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.
              </p>
              <p className="mt-3">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-3">4. Information Sharing</h2>
              <p>
                Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.
              </p>
              <p className="mt-3">
                Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-3">5. Cookies and Tracking</h2>
              <p>
                Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-3">6. Third-Party Services</h2>
              <p>
                Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.
              </p>
              <p className="mt-3">
                Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-3">7. Your Rights</h2>
              <p>
                Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
                <li>Nam libero tempore, cum soluta nobis est eligendi optio</li>
                <li>Cumque nihil impedit quo minus id quod maxime placeat facere possimus</li>
                <li>Omnis voluptas assumenda est, omnis dolor repellendus</li>
                <li>Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-3">8. Data Retention</h2>
              <p>
                Saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-3">9. Children's Privacy</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-3">10. Changes to Privacy Policy</h2>
              <p>
                Nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-3">11. Contact Us</h2>
              <p>
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}