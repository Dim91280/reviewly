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

function Privacy() {
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
            Politique de confidentialité
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.2', marginBottom: '1rem' }}>
            Vos données nous appartiennent<br />
            <span style={{ color: '#6366f1' }}>à vous, pas à nous.</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.7', fontFamily: 'system-ui, sans-serif' }}>
            Replio est un outil au service de votre commerce. Voici exactement comment nous traitons vos données personnelles, en toute transparence.
          </p>
        </div>

        {/* Sections */}
        <div style={{ fontFamily: 'system-ui, sans-serif' }}>

          <Section title="1. Responsable du traitement">
            <p>Le responsable du traitement des données collectées via {SITE} est :</p>
            <p style={{ marginTop: '0.5rem', padding: '0.75rem 1rem', backgroundColor: '#f1f5f9', borderRadius: '8px', color: '#334155' }}>
              <strong>{COMPANY}</strong><br />
              Email : <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#6366f1' }}>{CONTACT_EMAIL}</a>
            </p>
          </Section>

          <Section title="2. Données collectées">
            <p>Nous collectons uniquement les données nécessaires au fonctionnement du service :</p>
            <ul style={{ marginTop: '0.75rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li><strong>Données de compte</strong> — adresse email, mot de passe (chiffré), nom de l'établissement</li>
              <li><strong>Données de profil</strong> — secteur d'activité, ton de réponse IA, mots à éviter</li>
              <li><strong>Avis clients</strong> — contenu des avis importés depuis votre fiche Google Business</li>
              <li><strong>Données de paiement</strong> — traitées exclusivement par Stripe, nous ne stockons aucune donnée bancaire</li>
              <li><strong>Données de connexion Google</strong> — tokens OAuth pour accéder à votre fiche Google Business</li>
              <li><strong>Données techniques</strong> — logs de connexion, adresse IP (conservation 30 jours)</li>
            </ul>
          </Section>

          <Section title="3. Finalités du traitement">
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>Fourniture du service Replio (génération de réponses IA, synchronisation des avis)</li>
              <li>Gestion de votre abonnement et de la facturation</li>
              <li>Amélioration du service et détection des anomalies</li>
              <li>Communication liée au service (notifications d'avis, emails transactionnels)</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>Nous n'utilisons pas vos données à des fins publicitaires et ne les vendons jamais à des tiers.</p>
          </Section>

          <Section title="4. Base légale">
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li><strong>Exécution du contrat</strong> — traitement nécessaire pour fournir le service souscrit</li>
              <li><strong>Intérêt légitime</strong> — amélioration du service, sécurité</li>
              <li><strong>Obligations légales</strong> — conservation des données de facturation (10 ans)</li>
            </ul>
          </Section>

          <Section title="5. Partage des données">
            <p>Vos données sont partagées uniquement avec :</p>
            <ul style={{ marginTop: '0.75rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li><strong>Supabase</strong> — hébergement de la base de données (serveurs UE)</li>
              <li><strong>Anthropic</strong> — génération IA des réponses (les avis sont envoyés pour traitement, non conservés)</li>
              <li><strong>Stripe</strong> — paiements sécurisés</li>
              <li><strong>Google</strong> — via votre autorisation OAuth pour accéder à votre fiche Business</li>
              <li><strong>Resend</strong> — envoi d'emails transactionnels</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>Tous nos sous-traitants sont conformes au RGPD.</p>
          </Section>

          <Section title="6. Conservation des données">
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li><strong>Données de compte</strong> — durée de l'abonnement + 30 jours après résiliation</li>
              <li><strong>Avis et réponses</strong> — durée de l'abonnement</li>
              <li><strong>Données de facturation</strong> — 10 ans (obligation légale)</li>
              <li><strong>Logs techniques</strong> — 30 jours</li>
            </ul>
          </Section>

          <Section title="7. Vos droits (RGPD)">
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul style={{ marginTop: '0.75rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li><strong>Accès</strong> — obtenir une copie de vos données</li>
              <li><strong>Rectification</strong> — corriger vos données inexactes</li>
              <li><strong>Effacement</strong> — supprimer votre compte et vos données</li>
              <li><strong>Portabilité</strong> — recevoir vos données dans un format structuré</li>
              <li><strong>Opposition</strong> — vous opposer à certains traitements</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>
              Pour exercer vos droits, contactez-nous à{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#6366f1' }}>{CONTACT_EMAIL}</a>.
              Délai de réponse : 30 jours maximum.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              Vous pouvez également introduire une réclamation auprès de la{' '}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1' }}>CNIL</a>.
            </p>
          </Section>

          <Section title="8. Cookies">
            <p>Replio utilise uniquement des cookies strictement nécessaires au fonctionnement du service (session d'authentification). Aucun cookie publicitaire ou de tracking tiers n'est utilisé.</p>
          </Section>

          <Section title="9. Sécurité">
            <p>Vos données sont protégées par :</p>
            <ul style={{ marginTop: '0.75rem', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>Chiffrement HTTPS (TLS) sur toutes les communications</li>
              <li>Mots de passe hachés (bcrypt via Supabase Auth)</li>
              <li>Row Level Security (RLS) — chaque utilisateur n'accède qu'à ses propres données</li>
              <li>Tokens OAuth stockés de manière chiffrée</li>
            </ul>
          </Section>

          <Section title="10. Modifications">
            <p>
              Nous pouvons mettre à jour cette politique. En cas de changement significatif, vous serez notifié par email au moins 15 jours avant l'entrée en vigueur.
              La date de dernière mise à jour est indiquée en haut de cette page.
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
            <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Une question sur vos données ?</p>
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

export default Privacy
