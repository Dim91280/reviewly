import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const LAST_UPDATED = '11 mai 2026'
const CONTACT_EMAIL = 'contact@replios.com'
const COMPANY = 'Dimitri Quelever, entrepreneur individuel'
const SITE = 'replios.com'

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 style={{
        fontSize: '1.05rem',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '0.75rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid #e2e8f0'
      }}>{title}</h2>
      <div style={{ color: '#475569', fontSize: '0.925rem', lineHeight: '1.8' }}>
        {children}
      </div>
    </section>
  )
}

function Terms() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Georgia', serif" }}>

      {/* Header */}
      <div style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <img src="/replio-logo-wordmark-white.svg" alt="Replio" style={{ height: '24px' }} />
          </button>
          <span style={{ fontSize: '0.75rem', color: '#475569' }}>Dernière mise à jour : {LAST_UPDATED}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

        {/* Title */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-block',
            fontSize: '0.7rem',
            fontWeight: '600',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#6366f1',
            backgroundColor: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '999px',
            padding: '0.3rem 0.9rem',
            marginBottom: '1rem',
            fontFamily: 'system-ui, sans-serif'
          }}>
            Conditions Générales d'Utilisation
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.2', marginBottom: '1rem' }}>
            Des règles simples,<br />
            <span style={{ color: '#6366f1' }}>pour une relation claire.</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.7', fontFamily: 'system-ui, sans-serif' }}>
            Ces CGU régissent l'utilisation du service Replio disponible sur {SITE}. En créant un compte, vous acceptez ces conditions.
          </p>
        </div>

        {/* Sections */}
        <div style={{ fontFamily: 'system-ui, sans-serif' }}>

          <Section title="1. Présentation du service">
            <p>
              Replio est un service SaaS édité par <strong>{COMPANY}</strong>, permettant aux professionnels de gérer et de générer des réponses à leurs avis clients grâce à l'intelligence artificielle.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              Le service est accessible sur <a href={`https://${SITE}`} style={{ color: '#6366f1' }}>{SITE}</a> et nécessite la création d'un compte.
            </p>
          </Section>

          <Section title="2. Accès au service">
            <p>Le service est accessible aux professionnels (commerçants, restaurateurs, hôteliers, prestataires de services) disposant d'une fiche Google Business Profile.</p>
            <ul style={{ marginTop: '0.75rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>Vous devez avoir au moins 18 ans pour créer un compte</li>
              <li>Vous êtes responsable de la confidentialité de vos identifiants</li>
              <li>Un compte est réservé à un établissement (sauf abonnement multi-établissements)</li>
            </ul>
          </Section>

          <Section title="3. Abonnements et paiement">
            <p>Replio propose les offres suivantes :</p>
            <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { plan: 'Solo', price: '19 €/mois', desc: 'Pour un établissement' },
                { plan: 'Pro', price: '29 €/mois', desc: 'Fonctionnalités avancées' },
              ].map(({ plan, price, desc }) => (
                <div key={plan} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.75rem 1rem', backgroundColor: '#f1f5f9', borderRadius: '8px'
                }}>
                  <div>
                    <strong style={{ color: '#0f172a' }}>{plan}</strong>
                    <span style={{ color: '#64748b', marginLeft: '0.5rem', fontSize: '0.85rem' }}>{desc}</span>
                  </div>
                  <strong style={{ color: '#6366f1' }}>{price}</strong>
                </div>
              ))}
            </div>
            <ul style={{ marginTop: '0.75rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>Période d'essai gratuite de 14 jours, sans carte bancaire</li>
              <li>Facturation mensuelle, renouvelée automatiquement</li>
              <li>Paiement sécurisé via Stripe</li>
              <li>Résiliation possible à tout moment depuis votre espace compte</li>
              <li>Aucun remboursement pour la période en cours après résiliation</li>
            </ul>
          </Section>

          <Section title="4. Utilisation du service">
            <p>En utilisant Replio, vous vous engagez à :</p>
            <ul style={{ marginTop: '0.75rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>Utiliser le service pour votre activité professionnelle légitime uniquement</li>
              <li>Ne pas publier de réponses mensongères, diffamatoires ou trompeuses</li>
              <li>Respecter les conditions d'utilisation de Google Business Profile</li>
              <li>Ne pas tenter de contourner les limitations techniques du service</li>
              <li>Ne pas utiliser le service pour du spam ou des pratiques abusives</li>
            </ul>
          </Section>

          <Section title="5. Contenu généré par IA">
            <p>Les réponses générées par Replio sont produites par intelligence artificielle (Anthropic Claude). Vous êtes seul responsable :</p>
            <ul style={{ marginTop: '0.75rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>De la relecture et validation des réponses avant publication</li>
              <li>Du contenu publié sur votre fiche Google Business</li>
              <li>De la conformité des réponses avec la réglementation applicable</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>Replio fournit un outil d'assistance, non un service de publication automatique.</p>
          </Section>

          <Section title="6. Propriété intellectuelle">
            <p>Le service Replio, son interface, son code et ses algorithmes sont la propriété exclusive de {COMPANY}.</p>
            <p style={{ marginTop: '0.5rem' }}>Vos données (avis clients, réponses générées) restent votre propriété. Vous nous accordez une licence limitée pour les traiter dans le cadre du service.</p>
          </Section>

          <Section title="7. Disponibilité et maintenance">
            <p>Replio s'engage à maintenir une disponibilité du service de 99% par mois. Des interruptions ponctuelles pour maintenance peuvent survenir, avec notification préalable dans la mesure du possible.</p>
            <p style={{ marginTop: '0.5rem' }}>Nous ne pouvons être tenus responsables des interruptions liées à des services tiers (Google, Stripe, Supabase).</p>
          </Section>

          <Section title="8. Limitation de responsabilité">
            <p>Dans les limites permises par la loi française :</p>
            <ul style={{ marginTop: '0.75rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>Replio est fourni "en l'état", sans garantie de résultat sur votre réputation en ligne</li>
              <li>Notre responsabilité est limitée au montant mensuel de votre abonnement</li>
              <li>Nous ne sommes pas responsables des décisions prises sur la base des réponses générées</li>
            </ul>
          </Section>

          <Section title="9. Résiliation">
            <p><strong>Par vous</strong> — vous pouvez résilier à tout moment depuis votre espace compte. L'accès reste actif jusqu'à la fin de la période facturée.</p>
            <p style={{ marginTop: '0.5rem' }}><strong>Par Replio</strong> — nous nous réservons le droit de suspendre ou résilier un compte en cas de violation de ces CGU, après notification.</p>
            <p style={{ marginTop: '0.5rem' }}>En cas de résiliation, vos données sont supprimées dans un délai de 30 jours (hors obligations légales de conservation).</p>
          </Section>

          <Section title="10. Droit applicable">
            <p>
              Les présentes CGU sont soumises au droit français. En cas de litige, les parties s'engagent à rechercher une solution amiable avant tout recours judiciaire.
              À défaut d'accord, les tribunaux compétents seront ceux du ressort du domicile du défendeur.
            </p>
          </Section>

          <Section title="11. Modifications des CGU">
            <p>
              Nous pouvons modifier ces CGU. Vous serez notifié par email 15 jours avant toute modification substantielle.
              La poursuite de l'utilisation du service vaut acceptation des nouvelles conditions.
            </p>
          </Section>

          {/* Contact box */}
          <div style={{
            marginTop: '3rem',
            padding: '1.5rem',
            backgroundColor: 'rgba(99,102,241,0.05)',
            border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Une question sur ces conditions ?</p>
            <a href={`mailto:${CONTACT_EMAIL}`} style={{
              display: 'inline-block',
              color: '#6366f1',
              fontWeight: '600',
              fontSize: '0.95rem',
              textDecoration: 'none'
            }}>
              {CONTACT_EMAIL} →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Terms
