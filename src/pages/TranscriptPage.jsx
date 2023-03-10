/* eslint-disable no-undef */
import { useEffect, useRef, useState } from 'react'
import { Annotorious } from '@recogito/annotorious'
import { createWorker } from 'tesseract.js'
import { saveAs } from 'file-saver'
import { Buffer } from 'buffer'
import {
  Button,
  Grid,
  IconButton,
  Snackbar,
  Radio,
  RadioGroup,
  FormGroup,
  Checkbox,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import QRCode from 'qrcode'
import Draggable from 'draggable'
import QrScanner from 'qr-scanner'
import mergeImages from 'merge-images'
import Schema from '../protos/BoundingBox_pb'
import theme from '../utils/theme'
import '@recogito/annotorious/dist/annotorious.min.css'

const Input = styled('input')({
  display: 'none',
})

const TranscriptPage = () => {
  // Ref to the image DOM element
  const imgEl = useRef()

  const imgEl2 = useRef()

  // The current Annotorious instance
  const [anno, setAnno] = useState()

  const [anno2, setAnno2] = useState()

  // Current drawing tool name
  const [tool, setTool] = useState('rect')

  const [tool2, setTool2] = useState('rect')

  const [resuableBBoxes, setResuableBBoxes] = useState([])

  // Holds the Degree image base64
  const [transcriptImage, setTranscriptImage] = useState('')

  // Croped image from split functionality
  const [croppedImg, setCroppedImg] = useState('')

  // Hold the split bounding box state
  const [split, setSplit] = useState(false)

  // Hold the resuable bounding box state
  const [resuable, setResuable] = useState(false)

  const [openSplitModal, setOpenSplitModal] = useState(false)

  const handleOpenSplitModal = () => setOpenSplitModal(true)
  const handleCloseSplitModal = () => setOpenSplitModal(false)

  const [regex, setRegex] = useState(``)

  // Holds the QRCode image base64
  const [QRCodeImg, setQRCodeImg] = useState('')

  const [QRCodeX, setQRCodeX] = useState(null)

  const [QRCodeY, setQRCodeY] = useState(null)

  const [currentBoundingBox, setCurrentBoundingBox] = useState({})

  const [isBoundingBoxStatic, setIsBoundingBoxStatic] = useState('static')

  const [openBoundingBoxModal, setOpenBoundingBoxModal] = useState(false)

  const handleOpenBoundingBoxModal = () => setOpenBoundingBoxModal(true)
  const handleCloseBoundingBoxModal = () => setOpenBoundingBoxModal(false)

  const handleChangeRadioButton = (e) => setIsBoundingBoxStatic(e.target.value)

  // Holds BBoxes Values
  const [boundingBoxes, setBoundingBoxes] = useState([])
  const [boundingBoxesWithType, setBoundingBoxesWithType] = useState([])

  // Keep tracks of is user finished with bounding boxes
  const [isBBoxFinalized, setIsBBoxFinalized] = useState(false)

  // Holds the modal state
  // const [open, setOpen] = useState(false)

  // Hols the snackbar state
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    message: ``,
    backgroundColor: ``,
  })

  // Open the modal
  // const handleOpen = () => setOpen(true)

  // Close the modal
  // const handleClose = () => setOpen(false)

  // Predefined tags list for degree BBoxes
  const predefinedTrancriptTags = [
    'Student Name',
    'Father Name',
    'Serial No',
    'Roll No',
    'Registration No',
    'Degree Title',
    'Course Code',
    'Course',
    'Semester',
    'Campus',
    'Session',
    'GPA',
    'CGPA',
  ]

  // Make worker for OCR
  // Print each step of the processing.
  const worker = createWorker({
    logger: (m) => console.log(m),
  })

  /*
  Take base64 encoded image and rectangle coordinates of bounding box,
  then pass it to the OCR, OCR remove the extra pixels from the rectangle 
  and return the response.
  */
  const doOCR = async (image, rectangle) => {
    // Intializing the worker
    await worker.load()
    await worker.loadLanguage('eng')
    await worker.initialize('eng')

    const { data } = await worker.recognize(image, {
      rectangles: [rectangle],
    })

    return data
  }

  // Degree image handler.
  // When image change then this function fires.
  // Convert the blob to base64.
  // Set the base64 in 'degreeImage' state variable.
  const onTranscriptImageChange = (e) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (reader.readyState === 2) {
        setTranscriptImage(reader.result)
      }
    }

    const file = e.target.files[0]

    if (file) {
      reader.readAsDataURL(file)
    }
  }

  // Initialize Annotorious when the component
  // mounts, and keep the current 'anno'
  // instance in the application state
  useEffect(() => {
    let annotorious = null

    if (imgEl.current) {
      // Initialize annotorious
      annotorious = new Annotorious({
        image: imgEl.current,
        widgets: [
          {
            widget: 'TAG',
            vocabulary: predefinedTrancriptTags,
          },
        ],
      })

      // EVENT: Fires when the annotation is created
      annotorious.on('createAnnotation', async (annotation) => {
        // Check if the selected tag exists in the predefined
        // degree tags array
        const tagExists = annotation.body.find((tag) =>
          predefinedTrancriptTags.includes(tag.value)
        )

        // Only one tag is allowed for one annotation.
        if (annotation.body.length > 1) {
          annotorious.removeAnnotation(annotation)
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
          annotorious.removeAnnotation(annotation)
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
        annotorious.addAnnotation({
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
      annotorious.on('updateAnnotation', async (annotation) => {
        // Check if the selected tag exists in the predefined
        // degree tags array
        const tagExists = annotation.body.every((tag) =>
          predefinedTrancriptTags.includes(tag.value)
        )

        // If tag not exist, then remove the annotation
        // and stop the further execution
        if (!tagExists) {
          annotorious.removeAnnotation(annotation)
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
        annotorious.addAnnotation({
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
      annotorious.on('deleteAnnotation', (annotation) => {
        console.log('deleted', annotation)
      })
    }

    // Keep current Annotorious instance in state
    setAnno(annotorious)

    // Cleanup: destroy current instance
    return () => annotorious.destroy()

    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (croppedImg) {
      let annotorious2 = null

      if (imgEl2.current) {
        // Initialize annotorious
        annotorious2 = new Annotorious({
          image: imgEl2.current,
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
      return () => annotorious2.destroy()
    }

    // eslint-disable-next-line
  }, [croppedImg])

  // Set drawing tool to 'rect'
  const handleRectangleTool = () => {
    if (tool === 'polygon') {
      setTool('rect')
      anno.setDrawingTool('rect')
    }
  }

  // Set drawing tool to 'polygon'
  const handlePolygonTool = () => {
    if (tool === 'rect') {
      setTool('polygon')
      anno.setDrawingTool('polygon')
    }
  }

  // Set drawing tool to 'rect'
  const handleRectangleTool2 = () => {
    if (tool2 === 'polygon') {
      setTool2('rect')
      anno2.setDrawingTool('rect')
    }
  }

  // Set drawing tool to 'polygon'
  const handlePolygonTool2 = () => {
    if (tool2 === 'rect') {
      setTool2('polygon')
      anno2.setDrawingTool('polygon')
    }
  }

  // Create QRCode.
  // Serialize BBox values using Protobuf and store inside QRCode.
  const handleQRCode = async () => {
    setIsBBoxFinalized(true)

    // Converting JS Objects to protobuf (uInt8Array)
    const boundingBoxesProtobuf = []

    for (let i = 0; i < boundingBoxesWithType.length; i++) {
      const bBox = new Schema.BoundingBox()

      bBox.setX(boundingBoxesWithType[i].x)
      bBox.setY(boundingBoxesWithType[i].y)
      bBox.setWidth(boundingBoxesWithType[i].width)
      bBox.setHeight(boundingBoxesWithType[i].height)
      bBox.setType(boundingBoxesWithType[i].type)
      bBox.setLabel(boundingBoxesWithType[i].label)
      bBox.setRegex(boundingBoxesWithType[i].regex)

      const bBoxes = new Schema.BoundingBoxes()
      bBoxes.addBoundingboxitem(bBox)

      const bytes = bBoxes.serializeBinary()
      boundingBoxesProtobuf.push(bytes)
    }

    // Converting uInt8Arrays to base64 encoded string
    const boundingBoxesProtobufToBase64 = []

    for (let i = 0; i < boundingBoxesProtobuf.length; i++) {
      const base64 = Buffer.from(boundingBoxesProtobuf[i]).toString('base64')
      boundingBoxesProtobufToBase64.push(base64.concat(`END`))
    }

    // Draw the QRCode on degree image.

    QRCode.toDataURL(
      document.getElementById('qrcode-canvas'),
      boundingBoxesProtobufToBase64,
      {
        width: `50px`,
      },
      (err, url) => {
        if (err) {
          console.log('Error when drawing QRCODE: ', err)
        } else {
          setQRCodeImg(url)
        }
      }
    )

    // Clear all the BBoxes from the image.
    anno.clearAnnotations()
  }

  // Attach the QRCODE on Degree image, then download it.
  const downloadImage = async () => {
    try {
      const transformedImage = await mergeImages([
        { src: transcriptImage },
        {
          src: QRCodeImg,
          x: QRCodeX ? QRCodeX : 45,
          y: QRCodeY ? QRCodeY : 380,
        },
      ])

      saveAs(transformedImage, 'transcript-image-with-qrcode')
      setOpenSnackbar({
        open: true,
        message: `Sucessfully downloaded!`,
        backgroundColor: theme.palette.success.main,
      })
    } catch (err) {
      console.log('Cannot merge QRCODE with Transcript Image: ', err)
    }
  }

  // Take image with QRCODE, then read values from it.
  // Draw bounding boxes on that image based on these values.
  const uploadImageWithQRCODEHandler = (e) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (reader.readyState === 2) {
        const imageWithQRCode = reader.result
        setTranscriptImage(imageWithQRCode)

        QrScanner.scanImage(imageWithQRCode)
          .then((result) => {
            console.log('QRCODE DETECTED')

            console.log({ result })

            // Split base64 string to array of strings.
            const splittedResult = result.split('END')

            // Converting array of base64 strings to uInt8Arrays.
            const uInt8Arrays = []

            for (let i = 0; i < splittedResult.length - 1; i++) {
              const uInt8Array = new Uint8Array(
                Buffer.from(splittedResult[i], 'base64')
              )
              uInt8Arrays.push(uInt8Array)
            }

            // Deserialize uInt8Arrays using Protobuf schema.
            const deserializedArrays = []

            for (let i = 0; i < uInt8Arrays.length; i++) {
              const deserializedArray = Schema.BoundingBoxes.deserializeBinary(
                uInt8Arrays[i]
              )
              deserializedArrays.push(deserializedArray)
            }

            // Extract the the values of bounding boxes
            // from deserialized arrays.
            let backToBoundingBoxes = []

            for (let i = 0; i < deserializedArrays.length; i++) {
              const boundingBoxesArray = deserializedArrays[i].array[0][0]
              backToBoundingBoxes.push(boundingBoxesArray)
            }

            backToBoundingBoxes = backToBoundingBoxes.map((arr) => {
              const [x, y, width, height, type, label, regex] = arr
              return { x, y, width, height, type, label, regex }
            })

            // Transform the bounding boxes according to annotorious
            // library standard to draw the bounding boxes on image.
            const transformedBoundingBoxes = backToBoundingBoxes.map(
              (boundingBox, index) => {
                return {
                  '@context': 'http://www.w3.org/ns/anno.jsonld',
                  id: `#a88b22d0-6106-4872-9435-c78b5e89fede-${index}`,
                  type: 'Annotation',
                  body: [
                    {
                      type: 'TextualBody',
                      value: "It's Hallstatt in Upper Austria",
                    },
                  ],
                  target: {
                    selector: {
                      type: 'FragmentSelector',
                      conformsTo: 'http://www.w3.org/TR/media-frags/',
                      value: `xywh=pixel:${boundingBox.x},${boundingBox.y},${boundingBox.width},${boundingBox.height}`,
                    },
                  },
                }
              }
            )

            transformedBoundingBoxes.forEach((boundingBox) =>
              anno.addAnnotation(boundingBox)
            )
          })
          .catch((err) => {
            console.log('No QRCODE Found!', err)
          })
      }
    }

    const file = e.target.files[0]

    if (file) {
      reader.readAsDataURL(file)
    }
  }

  // Drag and Drop Feature for QRCode.
  const qrCodeCanvasElement = document.getElementById('qrcode-canvas')

  if (isBBoxFinalized) {
    const options = {
      setCursor: true,
      limit: {
        // boundary limitations
        x: [220, 1014],
        y: [123, 659],
      },
      onDrag: (_qrCodeCanvasElement, x, y) => {
        setQRCodeX(x)
        setQRCodeY(y)
      },
    }

    new Draggable(qrCodeCanvasElement, options)
  }

  const handleSubmit = async () => {
    const transformedCurrentBoundingBox = {
      ...currentBoundingBox,
      type: isBoundingBoxStatic,
      regex: regex,
    }

    if (isBoundingBoxStatic === `static`)
      delete transformedCurrentBoundingBox.regex

    setBoundingBoxesWithType((prevBoundingBoxes) => [
      ...prevBoundingBoxes,
      transformedCurrentBoundingBox,
    ])

    setIsBoundingBoxStatic(`static`)
    setRegex(``)

    if (split) {
      // Make an http request to the server for image croping
      const { data } = await axios.post('http://localhost:4000/crop-image', {
        image: transcriptImage,
        coordinates: {
          width: Math.abs(currentBoundingBox.width),
          height: Math.abs(currentBoundingBox.height),
          left: Math.abs(currentBoundingBox.x),
          top: Math.abs(currentBoundingBox.y),
        },
      })

      if (data.status) {
        const uInt8Array = Buffer.from(data.output, 'base64')
        const uInt8ArrayToBase64 = Buffer.from(uInt8Array).toString('base64')
        const croppedImage = 'data:image/jpeg;base64,' + uInt8ArrayToBase64

        setCroppedImg(croppedImage)
        handleOpenSplitModal()
        setSplit(false)
        handleCloseBoundingBoxModal()
      }
    }

    if (resuable) {
      setResuable(false)

      setResuableBBoxes((prevBoundingBoxes) => [
        ...prevBoundingBoxes,
        transformedCurrentBoundingBox,
      ])

      handleCloseBoundingBoxModal()
    }

    handleCloseBoundingBoxModal()
  }

  const handleSubmitSplitModal = () => {
    console.log('jhh')

    handleCloseSplitModal()
  }

  const splitModalJSX = (
    <Dialog open={openSplitModal} onClose={handleCloseSplitModal}>
      <DialogTitle>Splitted Image</DialogTitle>
      <DialogContent
        sx={{ width: '100%', display: croppedImg ? 'block' : 'none' }}
      >
        <img
          style={{ width: `100%` }}
          ref={imgEl2}
          src={croppedImg ? croppedImg : './demo.png'}
          alt="cropped-section"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmitSplitModal}>Submit</Button>
        <Button
          disabled={tool2 === 'rect'}
          variant="contained"
          color="secondary"
          disableElevation
          onClick={handleRectangleTool2}
        >
          Rectangle
        </Button>
        <Button
          disabled={tool2 === 'polygon'}
          variant="contained"
          color="secondary"
          disableElevation
          onClick={handlePolygonTool2}
        >
          Polygon
        </Button>
      </DialogActions>
    </Dialog>
  )

  const boundingBoxModalJSX = (
    <Dialog open={openBoundingBoxModal} onClose={handleCloseBoundingBoxModal}>
      <DialogTitle>Bounding Box Type</DialogTitle>
      <DialogContent sx={{ width: `450px` }}>
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">
            Select Bounding Box Type
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={isBoundingBoxStatic}
            onChange={handleChangeRadioButton}
          >
            <FormControlLabel
              value="static"
              control={<Radio />}
              label="Static"
            />
            <FormControlLabel
              value="dynamic"
              control={<Radio />}
              label="Dynamic"
            />
          </RadioGroup>
        </FormControl>
        <br />
        <FormControl>
          <FormLabel>Other Options</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  value={split}
                  onChange={(e) => setSplit(e.target.checked)}
                />
              }
              label="Split"
            />
            <FormControlLabel
              control={
                <Checkbox
                  value={resuable}
                  onChange={(e) => setResuable(e.target.checked)}
                />
              }
              label="Reuseable"
            />
          </FormGroup>
        </FormControl>
        <br />
        {isBoundingBoxStatic === `dynamic` && (
          <TextField
            variant="standard"
            label="Regex"
            value={regex}
            onChange={(e) => setRegex(e.target.value)}
          />
        )}

        <h3>List Of Resuable BBoxes.</h3>
        {resuableBBoxes.length > 0 &&
          resuableBBoxes.map((bb, index) => (
            <p
              onClick={handleCloseBoundingBoxModal}
              style={{ color: theme.palette.primary.main, cursor: 'pointer' }}
              key={index}
            >
              Resuable - {bb.label}
            </p>
          ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  )

  const snackbarActionJSX = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={() =>
        setOpenSnackbar({
          open: false,
          message: ``,
          backgroundColor: ``,
        })
      }
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  )

  return (
    <Grid container direction="column" alignItems="center">
      {boundingBoxModalJSX}
      {splitModalJSX}

      {/* Snakbar for error and success messages */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={openSnackbar.open}
        autoHideDuration={4000}
        onClose={() =>
          setOpenSnackbar({
            open: false,
            message: ``,
            backgroundColor: ``,
          })
        }
        message={openSnackbar.message}
        action={snackbarActionJSX}
        ContentProps={{
          style: {
            backgroundColor: openSnackbar.backgroundColor,
          },
        }}
      />
      {JSON.stringify(boundingBoxesWithType)}

      {/* Degree Image Upload Button */}
      <Grid
        item
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        gap={3}
      >
        <Grid item sx={{ margin: '20px 0' }}>
          <label htmlFor="transcript-upload-button">
            <Input
              accept="image/*"
              id="transcript-upload-button"
              multiple
              type="file"
              onChange={onTranscriptImageChange}
            />
            <Button
              disableElevation
              sx={{ textTransform: 'capitalize' }}
              variant="contained"
              component="span"
            >
              Upload Transcript
            </Button>
          </label>
        </Grid>

        <Grid item>
          <Button
            sx={{ textTransform: 'capitalize' }}
            disableElevation
            variant="contained"
            onClick={handleQRCode}
            disabled={!transcriptImage || boundingBoxes.length < 0}
          >
            QRCode
          </Button>
        </Grid>

        <Grid item>
          <Button
            sx={{ textTransform: 'capitalize' }}
            disableElevation
            variant="contained"
            onClick={downloadImage}
            disabled={!transcriptImage || !QRCode}
          >
            Download Image
          </Button>
        </Grid>

        <Grid item>
          <label htmlFor="image-with-qr-code">
            <Input
              accept="image/*"
              id="image-with-qr-code"
              multiple
              type="file"
              onChange={uploadImageWithQRCODEHandler}
            />
            <Button
              disableElevation
              sx={{ textTransform: 'capitalize' }}
              variant="contained"
              component="span"
            >
              Upload Image With QRCODE
            </Button>
          </label>
        </Grid>

        {/* Transcript Image Preview */}
        <div id="container-el">
          <Grid sx={{ display: transcriptImage ? 'block' : 'none' }} item>
            <img
              id="transcript-img"
              style={{ height: '650px', width: `100%` }}
              ref={imgEl}
              src={transcriptImage ? transcriptImage : './demo.png'}
              alt="transcript-degree-img"
            />
            <canvas
              style={{
                visibility: isBBoxFinalized ? 'visible' : 'hidden',
                position: 'absolute',
                top: 375,
                left: 260,
              }}
              id="qrcode-canvas"
            ></canvas>
          </Grid>
        </div>

        {/* Drawing Tools */}
        {transcriptImage && (
          <Grid
            sx={{ margin: '1em 0' }}
            gap={4}
            item
            container
            justifyContent="center"
          >
            <Grid item>
              <Button
                disabled={tool === 'rect'}
                variant="contained"
                color="secondary"
                disableElevation
                onClick={handleRectangleTool}
              >
                Rectangle
              </Button>
            </Grid>
            <Grid item>
              <Button
                disabled={tool === 'polygon'}
                variant="contained"
                color="secondary"
                disableElevation
                onClick={handlePolygonTool}
              >
                Polygon
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}

export default TranscriptPage
