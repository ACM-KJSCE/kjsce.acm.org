import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";
import "@fontsource-variable/geist";
import "./MemberCard.css";

/* ---------- icons ---------- */

const PlaceholderAvatar = () => (
  <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="100" height="100" fill="#c3cfe0" />
    <circle cx="50" cy="35" r="17" fill="#64809f" />
    <path d="M18 100 C18 70 32 61 50 61 C68 61 82 70 82 100 Z" fill="#64809f" />
  </svg>
);

const CodeforcesIcon = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <rect x="6" y="24" width="15" height="34" rx="2.5" fill="#3b8fee" />
    <rect x="24.5" y="8" width="15" height="50" rx="2.5" fill="#5aaaff" />
    <rect x="43" y="28" width="15" height="30" rx="2.5" fill="#a9d3ff" />
  </svg>
);

const CodechefIcon = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <circle cx="32" cy="32" r="30" fill="none" stroke="#3b8fee" strokeWidth="2.6" />
    <path
      d="M32 14c-6.6 0-11.5 4.9-11.5 11 0 3.9 1.9 6.5 4 8.6 1.3 1.3 2 2.5 2 4.4h11c0-1.9.7-3.1 2-4.4 2.1-2.1 4-4.7 4-8.6 0-6.1-4.9-11-11.5-11Z"
      fill="#8fc7ff"
    />
    <rect x="26.5" y="40" width="11" height="3.6" rx="1.2" fill="#8fc7ff" />
    <rect x="27.8" y="45.4" width="8.4" height="3.6" rx="1.2" fill="#8fc7ff" />
    <path
      d="M29.2 31l2.8-6 2.8 6M32 31v6"
      fill="none"
      stroke="#0b1b33"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GithubIcon = () => <FaGithub style={{ height: "100%", width: "auto" }} />;
const LinkedinIcon = () => <FaLinkedin style={{ height: "92%", width: "auto", marginTop: "4%", color: "#3b8fee" }} />;
const LeetcodeIcon = () => <SiLeetcode style={{ height: "96%", width: "auto", marginTop: "2%" }} />;

/* ---------- helpers ---------- */

const sizeClass = (text, base, limits) => {
  const [md, sm] = limits;
  if (text.length > sm) return `${base} ${base}--sm`;
  if (text.length > md) return `${base} ${base}--md`;
  return base;
};

const LINKS = [
  { key: "github", label: "GitHub", Icon: GithubIcon },
  { key: "linkedin", label: "LinkedIn", Icon: LinkedinIcon },
  { key: "leetcode", label: "LeetCode", Icon: LeetcodeIcon },
  { key: "codeforces", label: "Codeforces", Icon: CodeforcesIcon },
  { key: "codechef", label: "CodeChef", Icon: CodechefIcon },
];

/**
 * Team member card (portrait 2:3). Fills the width of its parent.
 */
export default function MemberCard({ member, year = "" }) {
  const name = (member.name ?? "").trim();
  const role = (member.role ?? "").trim();
  const quote = (member.quote ?? "").trim();
  const bio = (member.bio ?? "").trim();
  const links = LINKS.filter(({ key }) => member.links?.[key]);

  // "2026-2027" -> "2026 - 2027" in the header, kept as-is in the footer
  const headerYear = year.replace(/\s*[-–]\s*/, " - ");

  return (
    <article className="mc" aria-label={`${name}, ${role}`}>
      <div className="mc-accent mc-accent--tl-a" />
      <div className="mc-accent mc-accent--tl-b" />
      <div className="mc-accent-clip">
        <div className="mc-accent mc-accent--br" />
        <div className="mc-accent mc-accent--br-b" />
      </div>
      <div className="mc-frame" />

      <header className="mc-header">
        <span className="mc-header-org">KJSCE ACM</span>
        <span className="mc-rule" />
        <span className="mc-header-year">{headerYear}</span>
      </header>

      <div className="mc-body">
        <div className="mc-photo">
          {member.imageUrl ? (
            <img src={member.imageUrl} alt={name} />
          ) : (
            <PlaceholderAvatar />
          )}
        </div>

        <h3 className={sizeClass(name, "mc-name", [12, 15])}>{name}</h3>
        <p className={sizeClass(role, "mc-role", [14, 22])}>{role}</p>
        <div className="mc-divider" />

        {quote && <p className="mc-quote">&ldquo;{quote}&rdquo;</p>}
        {bio && <p className="mc-bio">{bio}</p>}

        {links.length > 0 && (
          <div className="mc-links">
            {links.map(({ key, label, Icon }, i) => (
              <span key={key} style={{ display: "contents" }}>
                {i > 0 && <span className="mc-link-sep" aria-hidden="true" />}
                <a
                  className="mc-link"
                  href={member.links[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} on ${label}`}
                >
                  <Icon />
                </a>
              </span>
            ))}
          </div>
        )}
      </div>

      <footer className="mc-footer">
        <span className="mc-rule" />
        <span className="mc-footer-text">KJSSE ACM {year}</span>
        <span className="mc-rule" />
      </footer>
    </article>
  );
}
