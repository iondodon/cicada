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
            }
        `}</style>
    </div>
);

export default Container;