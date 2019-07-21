const Container = (props) => (
    <div className={"container hack"} id={"container"}>
        {props.children}

        { /*language=SCSS*/ }
        <style jsx>{`
            .container {
                background: rgba(251, 250, 242, 0.79);
                -webkit-box-shadow: 0px 0px 29px 0px rgba(219,209,131,1);
                -moz-box-shadow: 0px 0px 29px 0px rgba(219,209,131,1);
                box-shadow: 0px 0px 29px 0px rgba(219,209,131,1);
                
                display: flex;
                flex-direction: column;
                min-width: 80%;
                max-width: 80%;
                padding: 0 5% 0 5%;
            }
        `}</style>
    </div>
);

export default Container;