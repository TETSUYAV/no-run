import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { FileText, Shield, CreditCard, Scale, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Conditions Générales (CGU & CGV) — No Run',
  description: 'Conditions générales d’utilisation du service No Run et conditions générales de vente des crédits d’exportation GPX.',
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f5]">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-14">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#fff2eb] text-[#fc5200] border border-[#ffd8c7]">
            <FileText className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#37352f] sm:text-3xl">
              Conditions Générales d’Utilisation et de Vente
            </h1>
            <p className="text-xs text-[#787774]">
              Document contractuel public • Entrée en vigueur : Septembre 2026
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-8 text-sm text-[#37352f] leading-relaxed">
          {/* Sommaire indicatif */}
          <div className="notion-card p-5 bg-[#fbfbfa] border border-[#ebe9e4]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9b9a97] mb-2">
              Sommaire
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#787774]">
              <a href="#cgu" className="hover:text-[#fc5200] transition-colors">
                Partie I — Conditions d’Utilisation (CGU)
              </a>
              <a href="#cgv" className="hover:text-[#fc5200] transition-colors">
                Partie II — Conditions de Vente (CGV)
              </a>
              <a href="#retractation" className="hover:text-[#fc5200] transition-colors">
                Article 7 — Rétractation (Art. L221-28)
              </a>
              <a href="#support" className="hover:text-[#fc5200] transition-colors">
                Article 9 — Support & Réclamations
              </a>
            </div>
          </div>

          {/* PARTIE 1: CGU */}
          <div id="cgu" className="pt-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="size-4 text-[#fc5200]" />
              <h2 className="text-lg font-bold text-[#37352f]">
                Partie I — Conditions Générales d’Utilisation (CGU)
              </h2>
            </div>

            <div className="space-y-4">
              <section className="notion-card p-6">
                <h3 className="text-sm font-bold text-[#37352f]">1. Objet du Service</h3>
                <p className="mt-2 text-xs text-[#787774]">
                  No Run (ci-après « le Service ») met à disposition un outil de modélisation cinématique,
                  d’interpolation altimétrique numérique (modèles topographiques SRTM et Copernicus) et de
                  génération de fichiers télémétriques au format ouvert GPX. Le service est destiné à des fins
                  de planification sportive, de simulation d’itinéraires et d’enregistrement virtuel d’activités.
                </p>
              </section>

              <section className="notion-card p-6">
                <h3 className="text-sm font-bold text-[#37352f]">
                  2. Responsabilité de l’Utilisateur & Plateformes Tierces
                </h3>
                <p className="mt-2 text-xs text-[#787774]">
                  L’utilisateur conserve l’entière et exclusive responsabilité de l’usage fait des fichiers
                  GPX générés par No Run et de leur éventuelle importation sur des plateformes tierces
                  (notamment Strava, Garmin Connect, Suunto, Coros ou Komoot). No Run est un outil indépendant,
                  strictement non affilié à Strava Inc. ou à toute autre entité tierce. L’utilisateur s’engage à
                  respecter les conditions d’utilisation de ces plateformes tierces.
                </p>
              </section>

              <section className="notion-card p-6">
                <h3 className="text-sm font-bold text-[#37352f]">
                  3. Disponibilité & Limitation de Garantie
                </h3>
                <p className="mt-2 text-xs text-[#787774]">
                  Le Service est fourni « en l’état ». Bien que No Run applique des algorithmes avancés de lissage
                  physiologique (GAP Minetti bi-passe, calculs de cadence et de fréquence cardiaque simulée),
                  aucune garantie d’acceptation automatique ou de validation par les serveurs tiers n’est
                  contractuellement consentie.
                </p>
              </section>

              <section className="notion-card p-6">
                <h3 className="text-sm font-bold text-[#37352f]">4. Propriété Intellectuelle</h3>
                <p className="mt-2 text-xs text-[#787774]">
                  L’ensemble de la structure du site, les interfaces utilisateur, les algorithmes de calcul de
                  pente et de vitesse simulée, ainsi que les éléments graphiques constituent des œuvres protégées.
                  Toute reproduction ou rétro-ingénierie sans accord préalable écrit est interdite.
                </p>
              </section>
            </div>
          </div>

          {/* PARTIE 2: CGV */}
          <div id="cgv" className="pt-6 border-t border-[#e9e8e4]">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="size-4 text-[#fc5200]" />
              <h2 className="text-lg font-bold text-[#37352f]">
                Partie II — Conditions Générales de Vente (CGV)
              </h2>
            </div>

            <div className="space-y-4">
              <section className="notion-card p-6">
                <h3 className="text-sm font-bold text-[#37352f]">
                  5. Nature des Produits & Modèle Tarifaire
                </h3>
                <p className="mt-2 text-xs text-[#787774]">
                  No Run fonctionne selon un modèle de paiement à l’usage (« Pay-as-you-go ») par packs de crédits
                  d’exportation numérique. <strong>Aucun abonnement récurrent n’est imposé</strong> : les crédits
                  acquis sont valables à vie et ne comportent aucune date d’expiration.
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-xs border border-[#e9e8e4] rounded-lg">
                    <thead className="bg-[#f7f6f3] text-[#37352f]">
                      <tr>
                        <th className="p-2.5 font-semibold">Formule</th>
                        <th className="p-2.5 font-semibold">Volume</th>
                        <th className="p-2.5 font-semibold">Prix TTC</th>
                        <th className="p-2.5 font-semibold">Validité</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e9e8e4] text-[#787774]">
                      <tr>
                        <td className="p-2.5 font-medium text-[#37352f]">Essai Découverte</td>
                        <td className="p-2.5">1 tracé offert</td>
                        <td className="p-2.5 text-emerald-600 font-semibold">0,00 €</td>
                        <td className="p-2.5">À l’inscription</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-[#37352f]">Pack Alibi Express</td>
                        <td className="p-2.5">3 crédits GPX</td>
                        <td className="p-2.5 font-semibold text-[#37352f]">2,99 €</td>
                        <td className="p-2.5">À vie / Sans engagement</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-[#37352f]">Pack Grasse Matinée</td>
                        <td className="p-2.5">10 crédits GPX</td>
                        <td className="p-2.5 font-semibold text-[#37352f]">6,99 €</td>
                        <td className="p-2.5">À vie / Sans engagement</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium text-[#37352f]">Pack Grand Chelem</td>
                        <td className="p-2.5">25 crédits GPX</td>
                        <td className="p-2.5 font-semibold text-[#37352f]">14,99 €</td>
                        <td className="p-2.5">À vie / Sans engagement</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="notion-card p-6">
                <h3 className="text-sm font-bold text-[#37352f]">6. Paiement Sécurisé</h3>
                <p className="mt-2 text-xs text-[#787774]">
                  Le règlement des commandes s’effectue comptant par carte bancaire (Visa, Mastercard, American
                  Express, Cartes Bancaires CB) via l’infrastructure sécurisée certifiée PCI-DSS de notre
                  prestataire <strong>Stripe Payments Europe, Ltd</strong>. Les transactions sont chiffrées selon le
                  protocole SSL/TLS. No Run ne stocke ni n’a accès aux numéros complets de carte bancaire.
                </p>
              </section>

              <section id="retractation" className="notion-card p-6 border-l-4 border-l-[#fc5200]">
                <div className="flex items-center gap-2">
                  <Scale className="size-4 text-[#fc5200]" />
                  <h3 className="text-sm font-bold text-[#37352f]">
                    7. Fourniture Numérique & Renonciation au Droit de Rétractation
                  </h3>
                </div>
                <div className="mt-2 space-y-2 text-xs text-[#787774]">
                  <p>
                    Conformément aux dispositions de <strong>l’article L. 221-28 13° du Code de la consommation français</strong>,
                    le droit de rétractation de 14 (quatorze) jours ne peut être exercé pour les contrats de fourniture
                    d’un contenu numérique sans support matériel dont l’exécution a commencé avec l’accord préalable
                    exprès du consommateur et renonciation expresse à son droit de rétractation.
                  </p>
                  <p className="p-3 bg-[#fff8f5] rounded-lg border border-[#fed7aa] text-[#9a3412]">
                    En procédant à la validation du paiement d’un pack de crédits sur No Run, l’utilisateur demande
                    l’accès immédiat aux crédits achetés et reconnaît renoncer expressément à l’exercice de son droit
                    de rétractation dès la mise à disposition des crédits sur son compte.
                  </p>
                </div>
              </section>

              <section id="support" className="notion-card p-6">
                <div className="flex items-center gap-2">
                  <HelpCircle className="size-4 text-[#fc5200]" />
                  <h3 className="text-sm font-bold text-[#37352f]">
                    8. Défaillance Technique & Réattribution de Crédits
                  </h3>
                </div>
                <p className="mt-2 text-xs text-[#787774]">
                  Dans l’hypothèse où un bug serveur avéré ou une indisponibilité technique de nos systèmes
                  empêcherait le téléchargement effectif du fichier GPX alors qu’un crédit a été débité, No Run
                  s’engage à recréditer le compte de l’utilisateur sans frais sur simple demande motivée transmise à
                  l’adresse : <code>contact@no-run.com</code> dans un délai de 30 jours suivant la commande.
                </p>
              </section>

              <section className="notion-card p-6">
                <h3 className="text-sm font-bold text-[#37352f]">9. Droit Applicable & Médiation</h3>
                <p className="mt-2 text-xs text-[#787774]">
                  Les présentes conditions générales sont régies par le droit français. En cas de contestation ou de
                  différend relatif à la validité, l’interprétation ou l’exécution du contrat, les parties s’engagent
                  à rechercher une solution amiable préalablement à toute action judiciaire auprès des juridictions
                  compétentes.
                </p>
              </section>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-[#787774]">
            <Link href="/privacy" className="hover:text-[#fc5200] transition-colors underline">
              Consulter également notre Politique de Confidentialité (RGPD)
            </Link>
            <Link href="/pricing" className="hover:text-[#fc5200] transition-colors font-medium text-[#fc5200]">
              Voir la grille des tarifs
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
