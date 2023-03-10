import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material'
import { useTheme } from '@mui/material'
import { Annotorious } from '@recogito/annotorious'
import '@recogito/annotorious/dist/annotorious.min.css'

const SplitModalComp = ({
  openSplitModal,
  handleCloseSplitModal,
  handleSubmitSplitModal,
  croppedImg,
  predefinedTrancriptTags,
  setOpenSnackbar,
  doOCR,
  setCurrentBoundingBox,
  setBoundingBoxes,
  handleOpenBoundingBoxModal,
}) => {
  const theme = useTheme()

  const croppedImgRef = useRef()

  const [anno2, setAnno2] = useState()

  const [tool, setTool] = useState('rect')

  // Set drawing tool to 'rect'
  const handleRectangleTool = () => {
    if (tool === 'polygon') {
      setTool('rect')
      anno2.setDrawingTool('rect')
    }
  }

  // Set drawing tool to 'polygon'
  const handlePolygonTool = () => {
    if (tool === 'rect') {
      setTool('polygon')
      anno2.setDrawingTool('polygon')
    }
  }

  useEffect(() => {
    let annotorious2 = null

    if (croppedImgRef.current) {
      // Initialize annotorious
      annotorious2 = new Annotorious({
        image: croppedImgRef.current,
        widgets: [
          {
            widget: 'TAG',
            vocabulary: predefinedTrancriptTags,
          },
        ],
      })

      // EVENT: Fires when the annotation is created
      annotorious2.on('createAnnotation', async (annotation) => {
        // Check if the selected tag exists in the predefined
        // degree tags array
        const tagExists = annotation.body.find((tag) =>
          predefinedTrancriptTags.includes(tag.value)
        )

        // Only one tag is allowed for one annotation.
        if (annotation.body.length > 1) {
          annotorious2.removeAnnotation(annotation)
          setOpenSnackbar({
            open: true,
            message: `Only one tag is allowed for annotation!`,
            backgroundColor: theme.palette.error.main,
          })
          return
        }

        // If tag not exist, then remove the annotation
        // and stop the further execution
        if (!tagExists) {
          annotorious2.removeAnnotation(annotation)
          setOpenSnackbar({
            open: true,
            message: `Only predefined tags are allowed!`,
            backgroundColor: theme.palette.error.main,
          })
          return
        }

        // Destructuring the bounding box coords
        const [left, top, width, height] = annotation.target.selector.value
          .split('xywh=pixel:')[1]
          .split(',')

        // Getting the image with bounding boxes
        const imageWithBBox = annotation.target.source

        // Preparing the rectangle
        const rectangle = { height, width, left, top }

        const data = await doOCR(imageWithBBox, rectangle)

        const boundingBox = {
          x: data.blocks[0].bbox.x0,
          y: data.blocks[0].bbox.y0,
          width: data.blocks[0].bbox.x1 - data.blocks[0].bbox.x0,
          height: data.blocks[0].bbox.y1 - data.blocks[0].bbox.y0,
          label: annotation.body[0].value,
        }

        setCurrentBoundingBox(boundingBox)

        setBoundingBoxes((prevBoundingBoxes) => [
          ...prevBoundingBoxes,
          boundingBox,
        ])

        // Shrink the bounding box
        annotorious2.addAnnotation({
          ...annotation,
          target: {
            selector: {
              ...annotation.target.selector,
              value: `xywh=pixel:${data.blocks[0].bbox.x0},${
                data.blocks[0].bbox.y0
              },${data.blocks[0].bbox.x1 - data.blocks[0].bbox.x0},${
                data.blocks[0].bbox.y1 - data.blocks[0].bbox.y0
              }`,
            },
          },
        })

        handleOpenBoundingBoxModal()
        // Open the modal soon after selection
        // handleOpen()
      })

      // EVENT: Fires when the annotation is updated
      annotorious2.on('updateAnnotation', async (annotation) => {
        // Check if the selected tag exists in the predefined
        // degree tags array
        const tagExists = annotation.body.every((tag) =>
          predefinedTrancriptTags.includes(tag.value)
        )

        // If tag not exist, then remove the annotation
        // and stop the further execution
        if (!tagExists) {
          annotorious2.removeAnnotation(annotation)
          return
        }

        // Destructuring the bounding box coords
        const [left, top, width, height] = annotation.target.selector.value
          .split('xywh=pixel:')[1]
          .split(',')

        // Getting the image with bounding boxes
        const imageWithBBox = annotation.target.source

        // Preparing the rectangle
        const rectangle = { height, width, left, top }

        const data = await doOCR(imageWithBBox, rectangle)

        // Shrink the bounding box
        annotorious2.addAnnotation({
          ...annotation,
          target: {
            selector: {
              ...annotation.target.selector,
              value: `xywh=pixel:${data.blocks[0].bbox.x0},${
                data.blocks[0].bbox.y0
              },${data.blocks[0].bbox.x1 - data.blocks[0].bbox.x0},${
                data.blocks[0].bbox.y1 - data.blocks[0].bbox.y0
              }`,
            },
          },
        })

        // Open the modal soon after selection
        // handleOpen()
      })

      // EVENT: Fires when the annotation is deleted
      annotorious2.on('deleteAnnotation', (annotation) => {
        console.log('deleted', annotation)
      })
    }

    // Keep current Annotorious instance in state
    setAnno2(annotorious2)

    // Cleanup: destroy current instance
    // return () => annotorious2.destroy()

    // eslint-disable-next-line
  }, [croppedImg])

  return (
    <Dialog open={openSplitModal} onClose={handleCloseSplitModal}>
      <DialogTitle>Splitted Image</DialogTitle>
      <DialogContent sx={{ width: '100%' }}>
        <img
          style={{ width: `100%` }}
          ref={croppedImgRef}
          src={croppedImg ? croppedImg : './demo.png'}
          alt='cropped-section'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmitSplitModal}>Submit</Button>

        <Button
          disabled={tool === 'rect'}
          variant='contained'
          color='secondary'
          disableElevation
          onClick={handleRectangleTool}
        >
          Rectangle
        </Button>

        <Button
          disabled={tool === 'polygon'}
          variant='contained'
          color='secondary'
          disableElevation
          onClick={handlePolygonTool}
        >
          Polygon
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SplitModalComp
