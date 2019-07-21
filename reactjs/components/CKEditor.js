import React, { Component } from 'react'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


class CKEditorWrapper extends Component {

    render() {
        return(
            <CKEditor
                editor={ ClassicEditor }
                {...this.props}
            />
        )
    }
}

export default CKEditorWrapper;