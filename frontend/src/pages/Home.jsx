import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Mail,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Download,
  Image,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { profileAPI, albumsAPI, achievementsAPI } from "../utils/api";
import toast from "react-hot-toast";

const ACH_CATEGORIES = [
  "All",
  "Award",
  "Certification",
  "Publication",
  "Project",
  "Education",
  "Other",
];
const ALBUM_TYPES = ["All", "Trip", "Achievement", "Event", "Other"];

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [albumFilter, setAlbumFilter] = useState("All");
  const [achFilter, setAchFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };
  const stagger = { show: { transition: { staggerChildren: 0.12 } } };

  useEffect(() => {
    Promise.all([
      profileAPI.get(),
      albumsAPI.getAll(),
      achievementsAPI.getAll(),
    ])
      .then(([p, al, a]) => {
        setProfile(p.data);
        setAlbums(al.data);
        setAchievements(a.data);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  const filteredAlbums = albums.filter(
    (a) => albumFilter === "All" || a.type === albumFilter,
  );
  const filteredAch = achievements.filter(
    (a) => achFilter === "All" || a.category === achFilter,
  );

  const typeColors = {
    Trip: "text-blue-400 border-blue-500/30",
    Achievement: "text-gold border-gold/30",
    Event: "text-purple-400 border-purple-500/30",
    Other: "text-gray-400 border-gray-500/30",
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-xs text-muted tracking-widest uppercase">
            Loading
          </p>
        </div>
      </div>
    );

  return (
    <div className="grain">
      {/* HERO */}
      <section
        id="hero"
        className="min-h-screen flex items-center relative overflow-hidden px-6 md:px-16"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        <motion.div
          className="max-w-4xl pt-24 md:pt-0"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          <motion.p variants={fadeUp} className="section-tag mb-6">
            Welcome to my portfolio
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95] text-white mb-6"
          >
            {profile?.name ? (
              profile.name.split(" ").map((word, i) => (
                <span
                  key={i}
                  className={i % 2 === 1 ? "text-gold italic block" : "block"}
                >
                  {word}
                </span>
              ))
            ) : (
              <>
                <span className="block">Your</span>
                <span className="block italic text-gold">Name</span>
              </>
            )}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="font-body text-xl md:text-2xl text-soft font-light mb-10 max-w-xl"
          >
            {profile?.tagline || "Creative professional & visual storyteller"}
          </motion.p>
          <motion.div variants={fadeUp} className="flex gap-4 flex-wrap">
            <a href="#gallery" className="btn-gold">
              View Albums
            </a>
            <a href="#achievements" className="btn-outline">
              Achievements
            </a>
            {profile?.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-outline flex items-center gap-2"
              >
                <Download size={14} /> Resume
              </a>
            )}
          </motion.div>
        </motion.div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-gold/50" />
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="py-24 md:py-36 px-6 md:px-16 max-w-7xl mx-auto"
      >
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="grid md:grid-cols-2 gap-16 md:gap-24 items-center"
        >
          <motion.div variants={fadeUp} className="relative">
            <div className="aspect-[3/4] bg-card border border-border overflow-hidden max-w-sm mx-auto md:mx-0">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="font-mono text-xs tracking-widest uppercase text-muted">
                    Your Photo Here
                  </p>
                </div>
              )}
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-gold/30" />
            <div className="absolute -top-4 -left-4 w-16 h-16 border border-gold/20" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <p className="section-tag mb-6">About Me</p>
            <h2 className="font-display text-4xl md:text-5xl font-medium text-white mb-6 leading-tight">
              The story <em className="text-gold">behind</em> the lens
            </h2>
            <p className="font-body text-soft text-lg leading-relaxed mb-8">
              {profile?.bio || "Tell your story here."}
            </p>
            <div className="flex flex-col gap-3 mb-8">
              {profile?.location && (
                <div className="flex items-center gap-3 text-muted font-body text-sm">
                  <MapPin size={16} className="text-gold" />
                  {profile.location}
                </div>
              )}
              {profile?.email && (
                <div className="flex items-center gap-3 text-muted font-body text-sm">
                  <Mail size={16} className="text-gold" />
                  {profile.email}
                </div>
              )}
              {profile?.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-muted hover:text-gold font-body text-sm transition-colors"
                >
                  <ExternalLink size={16} className="text-gold" />
                  {profile.website}
                </a>
              )}
            </div>
            <div className="flex gap-3 flex-wrap">
              {profile?.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline flex items-center gap-2 text-xs"
                >
                  <Github size={14} /> GitHub
                </a>
              )}
              {profile?.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline flex items-center gap-2 text-xs"
                >
                  <Linkedin size={14} /> LinkedIn
                </a>
              )}
              {profile?.twitter && (
                <a
                  href={profile.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline flex items-center gap-2 text-xs"
                >
                  <Twitter size={14} /> Twitter
                </a>
              )}
              {profile?.instagram && (
                <a
                  href={profile.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline flex items-center gap-2 text-xs"
                >
                  <Instagram size={14} /> Instagram
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ALBUMS */}
      <section id="gallery" className="py-24 md:py-36 bg-surface/50">
        <div className="px-6 md:px-16 max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="section-tag mb-4">
              Albums
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display text-4xl md:text-5xl font-medium text-white mb-8"
            >
              Trips & <em className="text-gold italic">Memories</em>
            </motion.h2>
            <motion.div
              variants={fadeUp}
              className="flex gap-2 flex-wrap mb-12"
            >
              {ALBUM_TYPES.filter(
                (t) => t === "All" || albums.some((a) => a.type === t),
              ).map((type) => (
                <button
                  key={type}
                  onClick={() => setAlbumFilter(type)}
                  className={`font-mono text-xs tracking-widest uppercase px-4 py-2 border transition-all duration-300 ${albumFilter === type ? "border-gold text-gold" : "border-border text-muted hover:border-gold/50 hover:text-soft"}`}
                >
                  {type}
                </button>
              ))}
            </motion.div>
          </motion.div>

          {filteredAlbums.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-border">
              <p className="font-mono text-xs text-muted tracking-widest uppercase">
                No albums yet
              </p>
              <p className="font-body text-soft mt-2 text-sm">
                Login as admin to create albums
              </p>
            </div>
          ) : (
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
            >
              {filteredAlbums.map((album) => (
                <motion.div key={album._id} variants={fadeUp}>
                  <Link
                    to={`/album/${album._id}`}
                    className="group block border border-border bg-card hover:border-gold/50 transition-all duration-300 overflow-hidden"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-surface relative">
                      {album.coverImage ? (
                        <img
                          src={album.coverImage}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image size={36} className="text-border" />
                        </div>
                      )}
                      <div
                        className={`absolute top-3 left-3 font-mono text-xs tracking-widest uppercase px-2 py-1 border bg-ink/80 backdrop-blur-sm ${typeColors[album.type] || typeColors.Other}`}
                      >
                        {album.type}
                      </div>
                      <div className="absolute bottom-3 right-3 font-mono text-xs text-white/80 bg-black/50 backdrop-blur-sm px-2 py-1 flex items-center gap-1">
                        <Image size={11} />
                        {album.photoCount || 0}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-xl text-white mb-2 group-hover:text-gold transition-colors">
                        {album.title}
                      </h3>
                      {album.description && (
                        <p className="font-body text-sm text-muted line-clamp-2 mb-3">
                          {album.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 text-xs text-muted font-mono">
                        {album.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={11} className="text-gold" />
                            {album.location}
                          </span>
                        )}
                        {album.date && (
                          <span className="flex items-center gap-1">
                            <Calendar size={11} className="text-gold" />
                            {album.date}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section
        id="achievements"
        className="py-24 md:py-36 px-6 md:px-16 max-w-7xl mx-auto"
      >
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.p variants={fadeUp} className="section-tag mb-4">
            Achievements
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="font-display text-4xl md:text-5xl font-medium text-white mb-8"
          >
            Milestones & <em className="text-gold italic">Honours</em>
          </motion.h2>
          <motion.div variants={fadeUp} className="flex gap-2 flex-wrap mb-12">
            {ACH_CATEGORIES.filter(
              (c) => c === "All" || achievements.some((a) => a.category === c),
            ).map((cat) => (
              <button
                key={cat}
                onClick={() => setAchFilter(cat)}
                className={`font-mono text-xs tracking-widest uppercase px-4 py-2 border transition-all duration-300 ${achFilter === cat ? "border-gold text-gold" : "border-border text-muted hover:border-gold/50 hover:text-soft"}`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
          {filteredAch.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-border">
              <p className="font-mono text-xs text-muted tracking-widest uppercase">
                No achievements yet
              </p>
            </div>
          ) : (
            <motion.div
              className="grid md:grid-cols-2 gap-6"
              variants={stagger}
            >
              {filteredAch.map((ach) => (
                <motion.div
                  key={ach._id}
                  variants={fadeUp}
                  className="border border-border bg-card p-8 relative group hover:border-gold/50 transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-500" />
                  <div className="flex items-start justify-between mb-4">
                    <span className="font-mono text-xs text-gold tracking-widest uppercase">
                      {ach.year}
                    </span>
                    <span className="text-2xl">{ach.icon}</span>
                  </div>
                  <h3 className="font-display text-xl md:text-2xl text-white mb-3">
                    {ach.title}
                  </h3>
                  <p className="font-body text-soft leading-relaxed text-sm mb-4">
                    {ach.description}
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {ach.link && (
                      <a
                        href={ach.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-gold hover:text-gold-light uppercase tracking-widest transition-colors"
                      >
                        <ExternalLink size={12} /> Learn more
                      </a>
                    )}
                    {ach.album && (
                      <Link
                        to={`/album/${ach.album}`}
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-blue-400 hover:text-blue-300 uppercase tracking-widest transition-colors"
                      >
                        <Image size={12} /> View Album
                      </Link>
                    )}
                  </div>
                  <div className="absolute bottom-4 right-4 font-mono text-xs text-border group-hover:text-gold/30 transition-colors uppercase tracking-widest">
                    {ach.category}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 md:py-36 bg-surface/50">
        <div className="px-6 md:px-16 max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="section-tag justify-center mb-6 before:hidden"
            >
              Get In Touch
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display text-4xl md:text-6xl font-medium text-white mb-6"
            >
              Let's <em className="text-gold italic">Connect</em>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="font-body text-soft text-lg mb-12 max-w-lg mx-auto"
            >
              Have a project in mind or just want to say hello?
            </motion.p>
            {profile?.email && (
              <motion.a
                variants={fadeUp}
                href={`mailto:${profile.email}`}
                className="inline-block font-display text-3xl md:text-4xl text-white hover:text-gold transition-colors duration-300 border-b border-gold/30 hover:border-gold pb-2"
              >
                {profile.email}
              </motion.a>
            )}
            <motion.div
              variants={fadeUp}
              className="flex justify-center gap-4 mt-12 flex-wrap"
            >
              {profile?.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline flex items-center gap-2"
                >
                  <Github size={14} /> GitHub
                </a>
              )}
              {profile?.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline flex items-center gap-2"
                >
                  <Linkedin size={14} /> LinkedIn
                </a>
              )}
              {profile?.twitter && (
                <a
                  href={profile.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline flex items-center gap-2"
                >
                  <Twitter size={14} /> Twitter
                </a>
              )}
              {profile?.instagram && (
                <a
                  href={profile.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline flex items-center gap-2"
                >
                  <Instagram size={14} /> Instagram
                </a>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border px-6 md:px-16 py-8 flex justify-between items-center flex-wrap gap-4">
        <p className="font-mono text-xs text-muted tracking-widest uppercase">
          © {new Date().getFullYear()} {profile?.name || "Portfolio"}
        </p>
        <p className="font-mono text-xs text-muted tracking-widest uppercase">
          Built with ♥ & React
        </p>
      </footer>
    </div>
  );
}
