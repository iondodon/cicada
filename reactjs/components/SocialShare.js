import React from "react";

import '../i18n';
import { withNamespaces } from 'react-i18next';

import {
    EmailShareButton,
    FacebookShareButton,
    InstapaperShareButton,
    LineShareButton,
    LinkedinShareButton,
    LivejournalShareButton,
    MailruShareButton,
    OKShareButton,
    PinterestShareButton,
    PocketShareButton,
    RedditShareButton,
    TelegramShareButton,
    TumblrShareButton,
    TwitterShareButton,
    ViberShareButton,
    VKShareButton,
    WhatsappShareButton,
    WorkplaceShareButton,
} from "react-share";

import {
    EmailIcon,
    FacebookIcon,
    InstapaperIcon,
    LineIcon,
    LinkedinIcon,
    LivejournalIcon,
    MailruIcon,
    OKIcon,
    PinterestIcon,
    PocketIcon,
    RedditIcon,
    TelegramIcon,
    TumblrIcon,
    TwitterIcon,
    ViberIcon,
    VKIcon,
    WeiboIcon,
    WhatsappIcon,
    WorkplaceIcon,
} from "react-share";

import {
    FacebookShareCount,
    OKShareCount,
    PinterestShareCount,
    RedditShareCount,
    TumblrShareCount,
    VKShareCount,
} from "react-share";
import keys from "../configs/keys";

class SocialShare extends React.Component {

    constructor(props, {t, children, href }){
        super(props, {t, children, href });
        this.t = t;

        this.state = {
            url: keys.DOMAIN
        };
    }

    async componentDidMount() {
        await this.setState({url: window.location.href});
    }


    render(){
        return (
            <div>

                <div className="alert alert-success">
                    <div className={"btns"}>
                        <FacebookShareButton url={this.state.url}>
                            <FacebookIcon  size={32} />
                            <br/>
                            <FacebookShareCount url={this.state.url} />
                        </FacebookShareButton>
                        <OKShareButton url={this.state.url}>
                            <OKIcon size={32} />
                            <br/>
                            <OKShareCount url={this.state.url} />
                        </OKShareButton>
                        <VKShareButton url={this.state.url}>
                            <VKIcon size={32} />
                            <br/>
                            <VKShareCount url={this.state.url} />
                        </VKShareButton>
                        <TwitterShareButton url={this.state.url}>
                            <TwitterIcon size={32} />
                        </TwitterShareButton>
                        <ViberShareButton url={this.state.url}>
                            <ViberIcon size={32} />
                        </ViberShareButton>
                        <WhatsappShareButton url={this.state.url}>
                            <WhatsappIcon size={32} />
                        </WhatsappShareButton>
                        <RedditShareButton url={this.state.url}>
                            <RedditIcon size={32} />
                            <br/>
                            <RedditShareCount url={this.state.url} />
                        </RedditShareButton>
                        <EmailShareButton url={this.state.url}>
                            <EmailIcon size={32} />
                        </EmailShareButton>
                        <MailruShareButton url={this.state.url}>
                            <MailruIcon size={32} />
                        </MailruShareButton>
                        <TelegramShareButton url={this.state.url}>
                            <TelegramIcon size={32} />
                        </TelegramShareButton>
                        <PinterestShareButton url={this.state.url}>
                            <PinterestIcon size={32} />
                            <br/>
                            <PinterestShareCount url={this.state.url} />
                        </PinterestShareButton>
                        <InstapaperShareButton url={this.state.url}>
                            <InstapaperIcon size={32} />
                            <br/>
                            <PinterestShareCount url={this.state.url} />
                        </InstapaperShareButton>
                    </div>
                </div>

                { /*language=SCSS*/ }
                <style jsx>{`                    
                    .alert {
                         display: flex;
                         flex-direction: row;
                         justify-content: center;
                    }
                `}</style>
            </div>
        );
    }
}

export default withNamespaces()(SocialShare);