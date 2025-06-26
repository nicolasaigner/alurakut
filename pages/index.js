import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import {AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet} from '../src/lib/AlurakutCommons';
import {ProfileRelationsBoxWrapper} from '../src/components/ProfileRelations';
import React from "react";
import styled from 'styled-components';
import { useRouter } from 'next/router';

// DebugPrint component removed

const ProfileImage = styled.img`
  border-radius: 8px;
`;

function ProfileSidebar(propriedades) {
    // console.log statements removed
    return (
        <Box as="aside">
            <ProfileImage src={`https://github.com/${propriedades.user.login}.png`} />
            <hr />

            <p>
                <a className="boxLink" href={`https://github.com/${propriedades.user.login}.png`} target="_blank">
                    @{propriedades.user.login}
                </a>
            </p>

            <hr />

            <AlurakutProfileSidebarMenuDefault />
        </Box>
    )
}

function ProfileRelationsBox(props) {
    const data = [];
    props.items.forEach((item, index) => {
        if (typeof item === "string") {
            data.push({id: index, title: item, image: `https://github.com/${item}.png`});
        } else if (typeof item === "object" && item.type === 'User') {
            data.push({id: item.id, title: item.login, image: item.avatar_url});
        } else {
            data.push({id: item.id, title: item.title, image: item.image});
        }
    });

    return (
        <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
                {props.title} ({props.items.length})
            </h2>


            <ul>
                {data.map((itemAtual) => { // Removed index and the condition "if (index <= 5)"
                    return (
                        <li key={itemAtual.id}>
                            <a href={`/users/${itemAtual.title}`}>
                                <img src={itemAtual.image}/>
                                <span>{itemAtual.title}</span>
                            </a>
                        </li>
                    )
                })}
            </ul>
        </ProfileRelationsBoxWrapper>
    );
}

export default function Home() {
    const router = useRouter();
    const githubUserFromQuery = router.query.user;

    const [comunidades, setComunidades] = React.useState([{
        id: '54646515165132156132',
        title: 'Eu odeio acordar cedo',
        image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
    }
    ]);

    const [user, setUser] = React.useState({});

    const pessoasFavoritas = [
        'juunegreiros',
        'omariosouto',
        'peas',
        'rafaballerini',
        'marcobrunodev',
        'felipefialho'
    ]

    const [seguidores, setSeguidores] = React.useState([]);

    React.useEffect(() => {
        const effectiveUser = githubUserFromQuery || 'nicolasaigner';

        async function fetchData(username) {
            if (!username) return; // Do not fetch if username is not determined yet

            try {
                const userResponse = await fetch(`https://api.github.com/users/${username}`);
                if (!userResponse.ok) {
                    // Handle user not found or other API errors
                    console.error(`GitHub user ${username} not found or API error.`);
                    setUser({ login: username, name: "User not found" }); // Basic user object for display
                    setSeguidores([]);
                    return;
                }
                const userData = await userResponse.json();
                setUser(userData);

                if (userData.followers_url) {
                    const followersResponse = await fetch(userData.followers_url);
                    const followersData = await followersResponse.json();
                    setSeguidores(followersData);
                } else {
                    setSeguidores([]);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setUser({ login: username, name: "Error fetching data" });
                setSeguidores([]);
            }
        }

        if (router.isReady) { // Ensure router.query is populated
            fetchData(effectiveUser);
        }
    }, [githubUserFromQuery, router.isReady]);

    return (
        <>
            <AlurakutMenu githubUser={user}/>
            <MainGrid>
                <div className="profileArea" style={{gridArea: 'profileArea'}}>
                    <ProfileSidebar user={user}/>
                </div>
                <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
                    <Box>
                        <h1 className="title">
                            Bem vindo(a), {user.name}
                        </h1>

                        <OrkutNostalgicIconSet/>
                    </Box>

                    <Box>
                        <h2 className="subTitle">
                            O que você deseja fazer?
                        </h2>

                        <form onSubmit={function handleCreateCommunity(e) {
                            e.preventDefault();
                            const dadosForm = new FormData(e.target);

                            if (dadosForm.get('title') && dadosForm.get('image')) {
                                let comunidade = {
                                    id: new Date().toISOString(),
                                    title: dadosForm.get('title'),
                                    image: 'https://placehold.it/300x300',
                                }

                                if (dadosForm.get('image').indexOf('http') !== -1) {
                                    comunidade.image = dadosForm.get('image');
                                }

                                const comunidadesAtualizadas = [...comunidades, comunidade];
                                setComunidades(comunidadesAtualizadas);
                            } else {
                                alert('Necessário um título e uma imagem para criar uma comunidade');
                            }


                        }}>
                            <div>
                                <input
                                    placeholder="Qual vai ser o nome da sua comunicade?"
                                    name="title"
                                    aria-label="Qual vai ser o nome da sua comunicade?"
                                    type="text"
                                />
                            </div>
                            <div>
                                <input
                                    placeholder="Coloque uma URL para usarmos de capa"
                                    name="image"
                                    aria-label="Coloque uma URL para usarmos de capa" />
                            </div>

                            <button>
                                Criar comunidade
                            </button>
                        </form>
                    </Box>
                </div>
                <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>

                    <ProfileRelationsBox items={seguidores} title="Seguidores" />
                    <ProfileRelationsBox items={pessoasFavoritas} title="Amigos" />
                    <ProfileRelationsBox items={comunidades} title="Minhas comunidades" />
                </div>
            </MainGrid>
        </>
    )
}
