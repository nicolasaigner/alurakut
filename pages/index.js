import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import {AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet} from '../src/lib/AlurakutCommons';
import {ProfileRelationsBoxWrapper} from '../src/components/ProfileRelations';
import React from "react";

function ProfileSidebar(propriedades) {
    console.log(propriedades);
    return (
        <Box as="aside">
            <img src={`https://github.com/${propriedades.githubUser}.png`} style={{borderRadius: '8px'}}/>
            <hr />

            <p>
                <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`} target="_blank">
                    @{propriedades.githubUser}
                </a>
            </p>

            <hr />

            <AlurakutProfileSidebarMenuDefault />
        </Box>
    )
}

export default function Home() {

    const [comunidades, setComunidades] = React.useState([{
        id: '54646515165132156132',
        title: 'Eu odeio acordar cedo',
        image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
    }
    ]);
    /*const comunidades = [
        'Alurakut'
    ];*/

    const usuarioAleatorio = {
        githubUser: 'nicolasaigner',
        firstName: 'Nícolas',
        lastName: 'Aigner'
    };

    const pessoasFavoritas = [
        'juunegreiros',
        'omariosouto',
        'peas',
        'rafaballerini',
        'marcobrunodev',
        'felipefialho'
    ]

    return (
        <>
            <AlurakutMenu githubUser={usuarioAleatorio.githubUser}/>
            <MainGrid>
                <div className="profileArea" style={{gridArea: 'profileArea'}}>
                    <ProfileSidebar githubUser={usuarioAleatorio.githubUser}/>
                </div>
                <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
                    <Box>
                        <h1 className="title">
                            Bem vindo(a), {usuarioAleatorio.firstName}
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
                    <ProfileRelationsBoxWrapper>
                        <h2 className="smallTitle">
                            Pessoas da comunidade ({pessoasFavoritas.length})
                        </h2>

                        <ul>
                            {pessoasFavoritas.map((itemAtual, index) => {
                                if (index <= 5) {
                                    return (
                                        <li key={itemAtual}>
                                            <a href={`/users/${itemAtual}`}>
                                                <img src={`https://github.com/${itemAtual}.png`}/>
                                                <span>{itemAtual}</span>
                                            </a>
                                        </li>
                                    )
                                }
                            })}
                        </ul>
                    </ProfileRelationsBoxWrapper>

                    <ProfileRelationsBoxWrapper>
                        <h2 className="smallTitle">
                            Minhas comunidades ({comunidades.length})
                        </h2>

                        <ul>
                            {comunidades.map((itemAtual, index) => {
                                if (index <= 5) {
                                    return (
                                        <li key={itemAtual.id}>
                                            <a href="https://github.com/nicolasaigner" target="_blank">
                                                <img src={itemAtual.image}/>
                                                <span>{itemAtual.title}</span>
                                            </a>
                                        </li>
                                    )
                                }
                            })}
                        </ul>
                    </ProfileRelationsBoxWrapper>
                </div>
            </MainGrid>
        </>
    )
}
