from roboflow import Roboflow
rf = Roboflow(api_key="ORzdAYHLX3XtWXTuNqLR")
project = rf.workspace("shiva-aulia-nazwa").project("bisindo-dataset-smbne")
version = project.version(1)
dataset = version.download("yolov8")
                