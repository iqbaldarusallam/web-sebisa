import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import TeamPhotoFrame from "@/components/TeamPhotoFrame";
import { getPublicCmsContent } from "@/lib/public/cms";
import type { Metadata } from "next";
import Image from "next/image";
import {
  HiBriefcase,
  HiMegaphone,
  HiUserGroup,
  HiWrenchScrewdriver,
} from "react-icons/hi2";
import type { IconType } from "react-icons";

type TeamMember = {
  name: string;
  division: string;
  position: string;
  description: string;
  image?: string | null;
};

type Division = {
  name: string;
  summary: string;
  accent: string;
  icon: IconType;
  members: TeamMember[];
};

const positionDescriptions: Record<string, string> = {
  "Chief Executive Officer":
    "Memimpin arah perusahaan, menentukan strategi bisnis, menjaga kualitas layanan, dan memastikan setiap divisi bergerak sesuai visi Sebisa Project.",
  "Co-Founder":
    "Mendampingi pengembangan bisnis, membantu keputusan strategis, dan menjaga koordinasi lintas divisi agar eksekusi berjalan konsisten.",
  "Human Resources":
    "Mengelola kebutuhan SDM, administrasi internal, koordinasi rekrutmen, dan menjaga alur kerja tim tetap tertata.",
  "Video Editor & Videographer":
    "Menangani proses produksi visual, mulai dari pengambilan gambar, editing video, hingga finalisasi konten.",
  "Content Planner":
    "Menyusun ide konten, kalender publikasi, brief produksi, dan arah komunikasi agar konten lebih konsisten.",
  "Virtual Assistant":
    "Membantu kebutuhan administrasi, koordinasi pekerjaan harian, dan support operasional agar proses lebih efisien.",
  "Business Development":
    "Membangun peluang kerja sama, menjaga relasi prospek, dan membantu pengembangan kebutuhan bisnis klien.",
  "Sales Representative":
    "Menghubungi calon klien, menjelaskan layanan, mengelola follow-up, dan membantu proses konversi penjualan.",
  "Social Media Specialist":
    "Mengelola publikasi konten, caption, jadwal posting, dan aktivitas sosial media brand secara konsisten.",
  "Web Developer":
    "Membangun dan mengembangkan website yang responsif, stabil, dan sesuai kebutuhan bisnis atau campaign.",
  "Graphic Design":
    "Membuat kebutuhan visual brand, desain konten, materi promosi, dan aset kreatif untuk berbagai kanal digital.",
  "Digital Marketing":
    "Menyusun strategi campaign, membaca performa digital, dan mengoptimalkan kanal pemasaran agar lebih terarah.",
  "General Affairs":
    "Mendukung kebutuhan operasional, administrasi umum, dan kelancaran aktivitas internal tim.",
};

const directors: TeamMember[] = [
  {
    name: "Fariz Fadli",
    division: "",
    position: "Chief Executive Officer",
    description: positionDescriptions["Chief Executive Officer"],
  },
  {
    name: "Kamila Zahra Salsabila",
    division: "",
    position: "Co-Founder",
    description: positionDescriptions["Co-Founder"],
  },
];

const members: TeamMember[] = [
  {
    name: "Amanda Hanifah Nur Hilizza",
    division: "Business Support",
    position: "Human Resources",
    description: positionDescriptions["Human Resources"],
  },
  {
    name: "Ridho Firdausman",
    division: "Business Support",
    position: "Human Resources",
    description: positionDescriptions["Human Resources"],
  },
  {
    name: "Henida Nuha Nafisa",
    division: "Business Support",
    position: "Human Resources",
    description: positionDescriptions["Human Resources"],
  },
  {
    name: "Salsabilla Restianita",
    division: "Business Support",
    position: "General Affairs",
    description: positionDescriptions["General Affairs"],
  },
  {
    name: "Muhammad Fauzan Akbar",
    division: "Production",
    position: "Video Editor & Videographer",
    description: positionDescriptions["Video Editor & Videographer"],
  },
  {
    name: "Oscadeon",
    division: "Production",
    position: "Content Planner",
    description: positionDescriptions["Content Planner"],
  },
  {
    name: "Diva Astriani",
    division: "Production",
    position: "Social Media Specialist",
    description: positionDescriptions["Social Media Specialist"],
  },
  {
    name: "Iqbal Darusallam",
    division: "Production",
    position: "Web Developer",
    description: positionDescriptions["Web Developer"],
  },
  {
    name: "Raditya Hafizh Sopian",
    division: "Production",
    position: "Content Planner",
    description: positionDescriptions["Content Planner"],
  },
  {
    name: "Muhamad Khalid Umar",
    division: "Production",
    position: "Graphic Design",
    description: positionDescriptions["Graphic Design"],
  },
  {
    name: "Shelomitha Kumala Mawardhany",
    division: "Virtual Assistant",
    position: "Virtual Assistant",
    description: positionDescriptions["Virtual Assistant"],
  },
  {
    name: "Bening Nuha Nirmala",
    division: "Virtual Assistant",
    position: "Virtual Assistant",
    description: positionDescriptions["Virtual Assistant"],
  },
  {
    name: "Vian Leviyani",
    division: "Marketing",
    position: "Business Development",
    description: positionDescriptions["Business Development"],
  },
  {
    name: "Khafiel Ramadhan Putra Riyano",
    division: "Marketing",
    position: "Sales Representative",
    description: positionDescriptions["Sales Representative"],
  },
  {
    name: "Amallya Salsabila Harahap",
    division: "Marketing",
    position: "Graphic Design",
    description: positionDescriptions["Graphic Design"],
  },
  {
    name: "Vidya Firya Fitriani",
    division: "Marketing",
    position: "Digital Marketing",
    description: positionDescriptions["Digital Marketing"],
  },
  {
    name: "Rhe Rizal Pizzi Alfansyah",
    division: "Marketing",
    position: "Digital Marketing",
    description: positionDescriptions["Digital Marketing"],
  },
];

const divisionMeta: Omit<Division, "members">[] = [
  {
    name: "Business Support",
    summary:
      "Menjaga operasional internal, kebutuhan administrasi, dan pengelolaan SDM agar tim bekerja lebih terstruktur.",
    accent: "#08BBD8",
    icon: HiUserGroup,
  },
  {
    name: "Production",
    summary:
      "Mengelola eksekusi kreatif dan teknis, mulai dari konten, desain, video, hingga pengembangan website.",
    accent: "#22C55E",
    icon: HiWrenchScrewdriver,
  },
  {
    name: "Virtual Assistant",
    summary:
      "Mendukung koordinasi pekerjaan, administrasi digital, dan kebutuhan operasional harian project.",
    accent: "#A78BFA",
    icon: HiBriefcase,
  },
  {
    name: "Marketing",
    summary:
      "Mendorong pertumbuhan bisnis melalui strategi pemasaran, relasi klien, sales, dan performa digital.",
    accent: "#F59E0B",
    icon: HiMegaphone,
  },
];

const divisions: Division[] = divisionMeta.map((division) => ({
  ...division,
  members: members.filter((member) => member.division === division.name),
}));

export const metadata: Metadata = {
  title: "Tim Kami | Sebisa Project",
  description:
    "Kenali struktur tim Sebisa Project berdasarkan divisi, posisi, dan tanggung jawab pekerjaan.",
};

function getInitials(name: string) {
  const words = name.split(" ").filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

function LeadershipPhoto({
  accent,
  member,
}: {
  accent: string;
  member: TeamMember;
}) {
  return (
    <div className="relative mx-auto aspect-[2/3] w-full max-w-[8.5rem] overflow-hidden rounded-lg bg-[#E6F7FF] shadow-lg shadow-black/15 sm:max-w-[18.5rem] sm:rounded-xl">
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: accent }}
      />
      {member.image ? (
        <Image
          src={member.image}
          alt={`Foto ${member.name}`}
          fill
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 90vw"
          className="object-cover object-top transition duration-300 group-hover:scale-[1.015]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white/35 bg-white/20 text-lg font-extrabold text-[#041B38] backdrop-blur sm:h-20 sm:w-20 sm:text-2xl">
            {getInitials(member.name)}
          </div>
        </div>
      )}
    </div>
  );
}

function LeadershipCard({
  index,
  member,
}: {
  index: number;
  member: TeamMember;
}) {
  const accent = index === 0 ? "#20C4E8" : "#A78BFA";

  return (
    <article className="group relative h-full overflow-hidden rounded-xl border border-white/12 bg-white/[0.08] p-2.5 shadow-lg shadow-black/10 transition hover:-translate-y-1 hover:bg-white/[0.12] sm:p-5 xl:grid xl:grid-cols-[18.5rem_minmax(0,1fr)] xl:gap-5">
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: accent }}
      />
      <LeadershipPhoto accent={accent} member={member} />

      <div className="mt-2.5 flex min-w-0 flex-col justify-center sm:mt-5 xl:mt-0">
        <span className="inline-flex w-fit rounded-full border border-white/12 bg-white/[0.08] px-2 py-1 text-[0.55rem] font-extrabold text-white/72 sm:px-3 sm:text-xs">
          Leadership
        </span>
        <h3 className="mt-2 text-[0.82rem] font-extrabold leading-tight text-white sm:mt-4 sm:text-2xl">
          {member.name}
        </h3>
        <p
          className="mt-1 text-[0.62rem] font-extrabold leading-tight sm:mt-2 sm:text-sm"
          style={{ color: accent }}
        >
          {member.position}
        </p>
        <p className="mt-2 line-clamp-3 text-[0.56rem] font-medium leading-3 text-white/70 sm:mt-4 sm:line-clamp-none sm:text-sm sm:leading-7">
          {member.description}
        </p>
      </div>
    </article>
  );
}

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <article className="group rounded-xl border border-white/12 bg-white/[0.08] p-2.5 shadow-lg shadow-black/10 transition hover:-translate-y-1 hover:bg-white/[0.12] sm:p-5">
      {member.image ? (
        <TeamPhotoFrame src={member.image} alt={`Foto ${member.name}`} />
      ) : (
        <div className="relative mx-auto aspect-[2/3] w-full max-w-[18rem] overflow-hidden rounded-lg bg-[#E6F7FF] sm:rounded-xl">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white/35 bg-white/20 text-lg font-extrabold text-[#041B38] backdrop-blur sm:h-20 sm:w-20 sm:text-2xl">
              {getInitials(member.name)}
            </div>
          </div>
        </div>
      )}

      <div className="mt-2.5 min-w-0 sm:mt-4">
        <h3 className="text-[0.72rem] font-extrabold leading-tight text-white sm:text-base">
          {member.name}
        </h3>
        <p className="mt-1 text-[0.58rem] font-extrabold leading-tight text-[#20C4E8] sm:text-xs">
          {member.position}
        </p>
        <p className="mt-2 line-clamp-3 text-[0.56rem] font-medium leading-3 text-white/68 sm:mt-3 sm:line-clamp-none sm:text-xs sm:leading-6">
          {member.description}
        </p>
      </div>
    </article>
  );
}

function DivisionSection({ division }: { division: Division }) {
  const Icon = division.icon;

  return (
    <section className="rounded-2xl border border-white/12 bg-[#0D1C35] p-5 shadow-xl shadow-sky-950/10 sm:p-6">
      <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.06] p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-[#041B38]"
            style={{ backgroundColor: division.accent }}
          >
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold leading-tight text-white">
              {division.name}
            </h2>
            <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-white/68">
              {division.summary}
            </p>
          </div>
        </div>

        <div className="inline-flex w-fit shrink-0 rounded-full border border-white/12 bg-white/[0.08] px-3 py-1.5 text-xs font-extrabold text-white/75">
          {division.members.length} anggota
        </div>
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-3 sm:gap-4">
        {division.members.map((member) => (
          <div
            key={`${division.name}-${member.name}`}
            className="basis-[calc((100%-0.75rem)/2)] xl:basis-[calc((100%-2rem)/3)]"
          >
            <MemberCard member={member} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function TimPage() {
  const cms = await getPublicCmsContent();
  const cmsDirectors = cms.team.filter(
    (member) =>
      member.division === "Leadership" ||
      member.position === "Chief Executive Officer" ||
      member.position === "Co-Founder",
  );
  const cmsMembers = cms.team.filter((member) => !cmsDirectors.includes(member));
  const pageDirectors = cmsDirectors.length > 0 ? cmsDirectors : directors;
  const pageDivisions =
    cmsMembers.length > 0
      ? divisionMeta.map((division) => ({
          ...division,
          members: cmsMembers.filter((member) => member.division === division.name),
        }))
      : divisions;

  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-[#0A1020] pt-28 text-white">
        <section className="relative px-6 pb-12 pt-7 sm:px-8 lg:px-20">
          <div className="absolute inset-0 opacity-55 [background:linear-gradient(120deg,#0A1020_0%,#132A4B_48%,#0879A8_140%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-white/15" />

          <div className="relative mx-auto max-w-7xl py-10">
            <span className="inline-flex rounded-full border border-[#20C4E8]/40 bg-[#20C4E8]/12 px-4 py-2 text-xs font-extrabold text-[#20C4E8]">
              TIM KAMI
            </span>
            <div className="mt-5 max-w-4xl">
              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Tim profesional yang bekerja dalam satu arah.
              </h1>
              <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-white/72 sm:text-lg">
                Sebisa Project didukung oleh pimpinan dan tim lintas fungsi
                yang menangani strategi, operasional, produksi kreatif, virtual
                assistant, hingga marketing secara terkoordinasi.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
              {pageDirectors.map((director, index) => (
                <LeadershipCard
                  key={director.name}
                  index={index}
                  member={director}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#DFF3FF] px-6 py-16 text-[#12345A] sm:px-8 lg:px-20">
          <div className="mx-auto max-w-7xl">
            <div>
              <span className="inline-flex rounded-full bg-[#12345A] px-4 py-2 text-xs font-extrabold text-white">
                DIVISI & POSISI
              </span>
              <h2 className="mt-5 max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl">
                Tim disusun berdasarkan fungsi kerja agar lebih mudah dipahami.
              </h2>
            </div>

            <div className="mt-10 space-y-6">
              {pageDivisions.map((division) => (
                <DivisionSection key={division.name} division={division} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
