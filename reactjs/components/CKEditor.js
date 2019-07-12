import React, { Component } from 'react'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


class CKEditorWrapper extends Component {
    render() {
        return(
            <div className={"puzzle-description"}>
                <CKEditor
                    editor={ ClassicEditor }
                    {...this.props}
                />

                { /*language=SCSS*/ }
                <style jsx>{`                    
                  .puzzle-description {
                    margin-top: 10px;
                    width: 100%;
                  }
                `}</style>
            </div>
        )
    }
}

export default CKEditorWrapper;