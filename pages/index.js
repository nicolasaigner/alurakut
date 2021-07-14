import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import {AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet} from '../src/lib/AlurakutCommons';
import {ProfileRelationsBoxWrapper} from '../src/components/ProfileRelations';
import React from "react";

const DebugPrint = (data) => {
    // https://stackoverflow.com/questions/30765163/pretty-printing-json-with-react
    const [show, setShow] = React.useState(false);

    return (
        <div key={1} className='root'>
            <div className='header' onClick={ ()=>{setShow(!show)} }>
                <strong>Debug</strong>
            </div>
            { show
                ? (
                    <pre className='pre'>
       {JSON.stringify(data, null, 2) }
      </pre>
                )
                : null
            }
        </div>
    )
}

function ProfileSidebar(propriedades) {
    console.log('PROFILE SIDEBAR', propriedades);

    console.log(`https://github.com/${propriedades.user.login}.png`);
    return (
        <Box as="aside">
            <img src={`https://github.com/${propriedades.user.login}.png`} style={{borderRadius: '8px'}}/>
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
                {data.map((itemAtual, index) => {
                    if (index <= 5) {
                        return (
                            <li key={itemAtual.id}>
                                <a href={`/users/${itemAtual.title}`}>
                                    <img src={itemAtual.image}/>
                                    <span>{itemAtual.title}</span>
                                </a>
                            </li>
                        )
                    }
                })}
            </ul>
        </ProfileRelationsBoxWrapper>
    );
}

export default function Home() {

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
        fetch(`https://api.github.com/users/nicolasaigner`)
            .then((respostaDoServidor) => {
                return respostaDoServidor.json();
            })
            .then((respostaCompleta) => {
                console.log('RESPOSTA COMPLETA', respostaCompleta);
                setUser(respostaCompleta);

                fetch(respostaCompleta.followers_url).then((followers) => {
                    return followers.json();
                })
                .then((respostaCompleta) => {
                    setSeguidores(respostaCompleta);
                });

            });
    }, []);

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
