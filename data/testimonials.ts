export type Testimonial = {
  name: string;
  role: string;
  comment: string;
  initials: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Nefertari D kiki",
    role: "Owner sambal goreng",
    comment:
      "Tampilan brand dan konten promosi kami jadi jauh lebih profesional. Customer lebih mudah percaya dan lebih paham penawaran kami.",
    initials: "AS",
  },
  {
    name: "Monkey D Lutpi",
    role: "Peternu one pis",
    comment:
      "Materi campaign dan alur digitalnya terasa interaktif, jadi leads dari iklan lebih mudah masuk dan dipantau.",
    initials: "MD",
  },
  {
    name: "roronoa sambal bakar",
    role: "owner pedang shisui",
    comment:
      "Strategi digitalnya membantu brand kami terlihat lebih rapi di banyak kanal, dari materi promosi sampai jalur konsultasi customer.",
    initials: "RS",
  },
];
