
export type Link = {
    id: string;
    title: string;
    description: {
        en: string;
        pt: string;
    };
    url: string;
}

export const links: Link[] = [
    {
        id: 'telegram',
        title: 'Telegram',
        description: {
            en: 'The easiest way to reach me',
            pt: 'A forma mais fácil de falar comigo'
        },
        url: 'https://t.me/roziscoding'
    },
    {
        id: 'github',
        title: 'GitHub',
        description: {
            en: 'Check out all my open source projects',
            pt: 'Confira todos os meus projetos open source'
        },
        url: 'https://github.com/roziscoding'
    },
    {
        id: 'linkedin',
        title: 'LinkedIn',
        description: {
            en: 'Follow my professional journey',
            pt: 'Veja minha trajetória profissional'
        },
        url: 'https://www.linkedin.com/in/roziscoding/'
    },
    {
        id: 'email',
        title: 'Email',
        description: {
            en: 'Drop me an email',
            pt: 'Entre em contato por email'
        },
        url: 'mailto:roz@rjmunhoz.me'
    }
]

