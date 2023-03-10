import { useEffect, useRef, useState } from 'react'
import { Annotorious } from '@recogito/annotorious'
import { createWorker } from 'tesseract.js'
import { saveAs } from 'file-saver'
import {
  Button,
  Grid,
  IconButton,
  Typography,
  Snackbar,
  Radio,
  RadioGroup,
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
import QRCode from 'qrcode'
import Draggable from 'draggable'
import QrScanner from 'qr-scanner'
import mergeImages from 'merge-images'
import theme from '../utils/theme'
import '@recogito/annotorious/dist/annotorious.min.css'
import { useNavigate } from 'react-router-dom'

const Input = styled('input')({
  display: 'none',
})

const HomePage = () => {

  // Ref to the image DOM element
  const imgEl = useRef()

  // For plus button
  const [plusForOpen, setPlusForOpen] = useState(false)

  // The current Annotorious instance
  const [anno, setAnno] = useState()

  // Current drawing tool name
  const [tool, setTool] = useState('rect')

  // Holds the Degree image base64
  const [degreeImage, setDegreeImage] = useState('')

  const [degreeImageBoundries, setDegreeImageBoundries] = useState({})

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

  // Navigation for changing pages
  const navigate = useNavigate()

  // Holds the modal state
  // const [open, setOpen] = useState(false)

  // Hols the snackbar state
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    message: ``,
    backgroundColor: ``,
  })

  // Predefined tags list for degree BBoxes
  const predefinedDegreeTags = [
    'Student Name',
    'Father Name',
    'Serial No',
    'Roll No',
    'Registration No',
    'Degree Title',
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

  // Degree image handler.
  // When image change then this function fires.
  // Convert the blob to base64.
  // Set the base64 in 'degreeImage' state variable.
  const onDegreeImageChange = (e) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (reader.readyState === 2) {
        setDegreeImage(reader.result)
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
            vocabulary: predefinedDegreeTags,
          },
        ],
      })

      // EVENT: Fires when the annotation is created
      annotorious.on('createAnnotation', async (annotation) => {
        // Check if the selected tag exists in the predefined
        // degree tags array
        const tagExists = annotation.body.find((tag) =>
          predefinedDegreeTags.includes(tag.value)
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
              value: `xywh=pixel:${data.blocks[0].bbox.x0},${data.blocks[0].bbox.y0
                },${data.blocks[0].bbox.x1 - data.blocks[0].bbox.x0},${data.blocks[0].bbox.y1 - data.blocks[0].bbox.y0
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
          predefinedDegreeTags.includes(tag.value)
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
              value: `xywh=pixel:${data.blocks[0].bbox.x0},${data.blocks[0].bbox.y0
                },${data.blocks[0].bbox.x1 - data.blocks[0].bbox.x0},${data.blocks[0].bbox.y1 - data.blocks[0].bbox.y0
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

  // Create QRCode.
  // Serialize BBox values using Protobuf and store inside QRCode.
  const handleQRCode = async () => {
    setIsBBoxFinalized(true)

    const degreeImage = document.getElementById('degree-img')
    const rects = degreeImage.getBoundingClientRect()

    setDegreeImageBoundries(rects)

    // S,D,Regex? (if D),Coords (x,y,width, height)
    let dataStr = ''

    for (let i = 0; i < boundingBoxesWithType.length; i++) {
      dataStr += `${boundingBoxesWithType[i].type === 'static' ? 'S' : 'D'},${boundingBoxesWithType[i].type === 'dynamic' &&
        boundingBoxesWithType[i].regex
        },${boundingBoxesWithType[i].x},${boundingBoxesWithType[i].y},${boundingBoxesWithType[i].width
        },${boundingBoxesWithType[i].height}:`
    }

    // Draw the QRCode on degree image.

    QRCode.toDataURL(
      document.getElementById('qrcode-canvas'),
      dataStr,
      {
        margin: 0,
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
        { src: degreeImage },
        {
          src: QRCodeImg,
          x: QRCodeX ? QRCodeX - degreeImageBoundries.x : 45,
          y: QRCodeY ? QRCodeY - degreeImageBoundries.y : 380,
        },
      ])

      saveAs(transformedImage, 'degree-image-with-qrcode')
      setOpenSnackbar({
        open: true,
        message: `Sucessfully downloaded!`,
        backgroundColor: theme.palette.success.main,
      })
    } catch (err) {
      console.log('Cannot merge QRCODE with Degree Image: ', err)
    }
  }

  // Take image with QRCODE, then read values from it.
  // Draw bounding boxes on that image based on these values.
  const uploadImageWithQRCODEHandler = (e) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (reader.readyState === 2) {
        const imageWithQRCode = reader.result
        setDegreeImage(imageWithQRCode)

        QrScanner.scanImage(imageWithQRCode)
          .then((result) => {
            console.log('QRCODE DETECTED')

            console.log({ result })

            // New Code with Comma Seprated String
            const splittedResult = result.split(':')

            console.log({ splittedResult })

            let boundingBoxes = []

            for (let i = 0; i < splittedResult.length - 1; i++) {
              const boundingBox = splittedResult[i].split(',')
              boundingBoxes.push({
                type: boundingBox[0],
                regex: boundingBox[1],
                x: boundingBox[2],
                y: boundingBox[3],
                width: boundingBox[4],
                height: boundingBox[5],
              })
            }

            console.log({ boundingBoxes })

            // Transform the bounding boxes according to annotorious
            // library standard to draw the bounding boxes on image.
            const transformedBoundingBoxes = boundingBoxes.map(
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
      // limit: {
      //   // boundary limitations
      //   x: [220, 1014],
      //   y: [123, 659],
      // },
      onDrag: (_qrCodeCanvasElement, x, y) => {
        setQRCodeX(x)
        setQRCodeY(y)
      },
    }

    new Draggable(qrCodeCanvasElement, options)
  }

  const handleSubmit = () => {
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

    handleCloseBoundingBoxModal()
  }

  // Custom Templates Button
  const plusHandler = () => {
    if (!plusForOpen) {
      setPlusForOpen('You can add custom template here')
      // onDegreeImageChange()

    } else {
      setPlusForOpen(false)
    }
  }

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
        {isBoundingBoxStatic === `dynamic` && (
          <TextField
            variant="standard"
            label="Regex"
            value={regex}
            onChange={(e) => setRegex(e.target.value)}
          />
        )}
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
    // Simple as that homePage and others template
    <Grid
      container
      justifyContent='center'
      direction='column'
      alignItems='center'
    >
      <Grid item sx={{ margin: `2em 0` }}>
        <Typography variant='h6'>Select template according to your document or if you have any other type of document press the plus button </Typography>
      </Grid>
      <Grid item container direction='row' justifyContent='center' gap={4}>
        <Grid item>
          <Button
            sx={{ textTransform: 'capitalize' }}
            variant='outlined'
            onClick={() => navigate('/degree-page')}
          >
            Degree Template
          </Button>
        </Grid>
        <Grid item>
          <Button
            sx={{ textTransform: 'capitalize' }}
            variant='outlined'
            onClick={() => navigate('/transcript-page')}
          >
            Transcript Template
          </Button>
        </Grid>
        <Grid item>
          <Button
            sx={{ textTransform: 'capitalize' }}
            variant='outlined'
            onClick={() => navigate('/cnic-page')}
          >
            CNIC Template
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant='outlined'
            onClick={plusHandler}
          >
            +
          </Button>
        </Grid>
      </Grid>

      {/* For adding custom template */}


      <Grid container direction="column" alignItems="center">
        {boundingBoxModalJSX}
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
        {plusForOpen && JSON.stringify(boundingBoxesWithType)}

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
            <label htmlFor="degree-upload-button">
              <Input
                accept="image/*"
                id="degree-upload-button"
                multiple
                type="file"
                onChange={onDegreeImageChange}
              />
              {plusForOpen && <Button
                disableElevation
                sx={{ textTransform: 'capitalize' }}
                variant="contained"
                component="span"
              >
                Upload Degree
              </Button>}
            </label>
          </Grid>

          {plusForOpen && <Grid item>
            <Button
              sx={{ textTransform: 'capitalize' }}
              disableElevation
              variant="contained"
              onClick={handleQRCode}
              disabled={!degreeImage || boundingBoxes.length < 0}
            >
              QRCode
            </Button>
          </Grid>}

          {plusForOpen && <Grid item>
            <Button
              sx={{ textTransform: 'capitalize' }}
              disableElevation
              variant="contained"
              onClick={downloadImage}
              disabled={!degreeImage || !QRCode}
            >
              Download Image
            </Button>
          </Grid>}

          <Grid item>
            <label htmlFor="image-with-qr-code">
              <Input
                accept="image/*"
                id="image-with-qr-code"
                multiple
                type="file"
                onChange={uploadImageWithQRCODEHandler}
              />
              {plusForOpen && <Button
                disableElevation
                sx={{ textTransform: 'capitalize' }}
                variant="contained"
                component="span"
              >
                Upload Image With QRCODE
              </Button>}
            </label>
          </Grid>

          {/* Degree Image Preview */}
          <div id="container-el">
            <Grid sx={{ display: degreeImage ? 'block' : 'none' }} item>
              <img
                id="degree-img"
                // style={{ height: '650px', width: `100%` }}
                ref={imgEl}
                src={degreeImage ? degreeImage : './demo.png'}
                alt="user-degree-img"
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
          {degreeImage && (
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

          {/* Modal Comp */}
          {/* <ModalComp open={open} handleClose={handleClose} /> */}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default HomePage
