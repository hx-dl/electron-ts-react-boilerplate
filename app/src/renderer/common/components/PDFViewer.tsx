import React from 'react'
import { Modal } from 'antd'
import styled, { createGlobalStyle } from 'styled-components'

interface PropsStruct {
    pdfPath?: string,
    visible: boolean,
    onCancel: () => void
}
/**
 * electron chromium自身能力加载pdf演示实例
 */
function PDFViewer(props: PropsStruct) {

    return (
        <Modal
            className="pdf-viewer"
            title="PDF文件预览"
            visible={props.visible}
            footer={null}
            width="860px"
            onCancel={props.onCancel}>
            <Wrapper>
                <iframe id="pdf" src={props.pdfPath} frameBorder="0" scrolling="no" />
            </Wrapper>
            <GlobalStyle />
        </Modal>
    )
}

const GlobalStyle = createGlobalStyle`
  .pdf-viewer {
    top: 10vh;
    height: 85vh;
    .ant-modal-header{
        padding: 8px 24px;
    }
    .ant-modal-close-x{
        line-height: 40px;
    }
    .ant-modal-body{
            padding: 0;
            padding-bottom: 0 !important;
            font-size: 0;
            height: calc(80vh - 55px);
            overflow: hidden;
        }
  }
`
const Wrapper = styled.div`
    height: 100%;
    #pdf {
        width: 100%;
        height: 100%;
    }
`

export default PDFViewer
