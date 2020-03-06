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

class SocialShare extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {};
    }


    render(){
        return (
            <div>

                <div className="alert alert-success">
                    <div className={"btns"}>
                        <FacebookShareButton url={location.href}>
                            <FacebookIcon  size={32} />
                            <br/>
                            <FacebookShareCount url={location.href} />
                        </FacebookShareButton>
                        <OKShareButton url={location.href}>
                            <OKIcon size={32} />
                            <br/>
                            <OKShareCount url={location.href} />
                        </OKShareButton>
                        <VKShareButton url={location.href}>
                            <VKIcon size={32} />
                            <br/>
                            <VKShareCount url={location.href} />
                        </VKShareButton>
                        <TwitterShareButton url={location.href}>
                            <TwitterIcon size={32} />
                        </TwitterShareButton>
                        <ViberShareButton url={location.href}>
                            <ViberIcon size={32} />
                        </ViberShareButton>
                        <WhatsappShareButton url={location.href}>
                            <WhatsappIcon size={32} />
                        </WhatsappShareButton>
                        <RedditShareButton url={location.href}>
                            <RedditIcon size={32} />
                            <br/>
                            <RedditShareCount url={location.href} />
                        </RedditShareButton>
                        <EmailShareButton url={location.href}>
                            <EmailIcon size={32} />
                        </EmailShareButton>
                        <MailruShareButton url={location.href}>
                            <MailruIcon size={32} />
                        </MailruShareButton>
                        <TelegramShareButton url={location.href}>
                            <TelegramIcon size={32} />
                        </TelegramShareButton>
                        <PinterestShareButton url={location.href}>
                            <PinterestIcon size={32} />
                            <br/>
                            <PinterestShareCount url={location.href} />
                        </PinterestShareButton>
                        <InstapaperShareButton url={location.href}>
                            <InstapaperIcon size={32} />
                            <br/>
                            <PinterestShareCount url={location.href} />
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