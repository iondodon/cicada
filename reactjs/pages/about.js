import React from 'react';
import Layout from "../components/Layout";
import Dashboard from "../components/Dashboard";

import '../i18n';
import { withNamespaces } from 'react-i18next';
import Head from "next/head";
import LeftPanel from "../components/LeftPanel";
import SocialShare from "../components/SocialShare";
import config from '../configs/keys';

class About extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;
    }

    render(){
        return (
            <Layout>
                <Head>
                    <title>Cicada | About</title>
                    <scr name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>

                <Dashboard>
                    <LeftPanel>
                        <div className="card specific">
                            <header className="card-header">Cicada 3301</header>
                            <div className="card-content">
                                <div className="inner">
                                    Cicada 3301 is a nickname given to an organization that on three occasions has posted a set of puzzles to recruit codebreakers from the public. The first internet puzzle started on January 4, 2012 on 4chan and ran for approximately one month.
                                </div>
                            </div>
                        </div>
                    </LeftPanel>

                    <div className="card page-content" id={"page-content"}>
                        {/*<header className="card-header"></header>*/}
                        <div className="card-content">
                            <div className="inner">
                                <div>



                                    <p>
                                        The idea of creating this site came from a puzzle made-up by a secret group in 2014. This puzzle consisted in two levels/rounds and was created to indentificate clever people, who’ve got general knowledge about multifarious domains, and especially, cryptography.
                                    </p>

                                    <p>
                                        Cicadapuzzle gives you the possibility to create your own puzzles and to show them to the people desirous of solving puzzles in order to improve and better their mind.
                                    </p>

                                    <p>
                                        Creating puzzles signifies a method by which you can augment the vigor of your rationality, because they are intricate and they demand logical, lucid elements, which ought to be perceived by the player as interesting and vivid ones.
                                    </p>

                                    <p>
                                        The game is mostly based on the player’s intuition and general knowledge. However, the player shouldn’t be immersed in every domain or theme regarding general knowledge, inasmuch as puzzles can be created based on one specific domain, such as history, archeology, cryptography, linguistics, etc.
                                    </p>

                                    <p>
                                        The purpose of the game is to solve each part of the puzzle through finding out the secret code of each part.
                                    </p>

                                    <p>
                                        In order to solve a puzzle, the player can log as a team or a singular participant. If you’re logged via a team, the achievements regarding the puzzle will be shown identically to every member of the team.
                                    </p>

                                    <h2>
                                        Creating Puzzles Rules
                                    </h2>

                                    Entering this platform denotes your agreement with the following rules:

                                    <ol>
                                        <li>
                                            Puzzles mustn’t provide violence elements towards the player. They mustn’t provoke the player to make actions that can jeopardize his life. They mustn’t contain erotic themes or elements that can mar and alter the psychological state of the player.
                                        </li>
                                        <li>
                                            There aren’t allowed puzzles with opaque content.
                                        </li>
                                        <li>
                                            The levels must be connected one to each other within a logical link. The previous level must suggest the next one.
                                        </li>
                                        <li>
                                            Every person is individually responsible for his own actions and for their consequences.
                                        </li>
                                        <li>
                                            Cicadapuzzle doesn’t bear responsibility for the actions or decisions made up by the players, neither for the content provided by the puzzles.
                                        </li>
                                        <li>
                                            The general description of a puzzle must have at least 20 characters.
                                        </li>
                                        <li>
                                            The code of each level must have a length of at least three characters.
                                        </li>
                                        <li>
                                            The description of each level must have a length of at least 10 characters.
                                        </li>
                                    </ol>

                                    <h2>
                                        Teams/Groups
                                    </h2>

                                    <p>
                                        By creating a team, the creator implicitly becomes a member, however, he can leave it and later, add himself back. The achievements and the evolution of the team will be identified as a commun result, but not as an individual one of every member. The characteristics of a team can be edited only by the person who created it, hence, members can be added or removed only by the creator/admin.
                                    </p>

                                    <h2>
                                        Contests
                                    </h2>

                                    <p>
                                        Participants at the contests can be both teams or solo players. The winner of a contest is the first participant who solves all levels of the puzzle before the time ends. If a participant wins the contest, other participants can continue to solve the puzzle. Registrating to a contest implies registrating to a specific puzzle on which the contest was created.
                                    </p>

                                </div>
                                <SocialShare message={config.GLOBAL_SOCIAL_MESSAGE} />
                            </div>
                        </div>
                    </div>
                </Dashboard>

                { /*language=SCSS*/ }
                <style jsx>{`
                    .page-content {
                      display: flex;
                      flex-direction: column;
                      min-width: 75%;
                      max-width: 75%;
                    }
                    
                    //.goodbye-message {
                    //  text-align: center;
                    //}
                    
                    .card-content {
                        padding: 2rem;
                    }
                    
                    .specific {
                      height: 100%;
                    }
                `}</style>
            </Layout>
        );
    }
}

export default withNamespaces()(About);