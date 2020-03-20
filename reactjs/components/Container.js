const Container = (props) => (
    <div className={"container hack"} id={"container"}>
        {props.children}

        { /*language=SCSS*/ }
        <style jsx>{`
            .container {
                display: flex;
                flex-direction: column;
                min-width: 80%;
                max-width: 80%;
                min-height: 100%;

                //  background-color: #cccccc;
                //  --webkit-box-shadow: 10px 10px 59px 5px #cccccc;
                //   -moz-box-shadow: 10px 10px 59px 5px #cccccc;
                // box-shadow: 10px 10px 59px 5px #cccccc;
            }
        `}</style>
    </div>
);

export default Container;