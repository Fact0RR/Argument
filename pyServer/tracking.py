from typing import List
import numpy as np
import cv2
import ultralytics

NUM_CLASSES = 4
CLASS_NAMES = {
    0: "glass",
    1: "metal",
    2: "plastic",
    3: "wood",
}

def get_video_writer(output_video_path: str, input_video: cv2.VideoCapture) -> cv2.VideoWriter:
    return cv2.VideoWriter(
        output_video_path,
        # cv2.VideoWriter_fourcc(*'XVID'),
        cv2.VideoWriter_fourcc(*"H264"),
        input_video.get(cv2.CAP_PROP_FPS),
        (int(input_video.get(cv2.CAP_PROP_FRAME_WIDTH)), int(input_video.get(cv2.CAP_PROP_FRAME_HEIGHT))),
    )

def draw_frame(result: ultralytics.engine.results.Results, cls_ids: list) -> np.array:
    frame = result.plot()
    cv2.rectangle(frame, (0, 0), (200, (25 * NUM_CLASSES) + 10), (255, 255, 255), -1)
    for cls, name in CLASS_NAMES.items():
        text = f"{name}: {len(cls_ids[cls])}"
        cv2.putText(
            frame,
            text,
            (0, 25 * (1 + cls)),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 0, 0),
            2,
            cv2.LINE_AA,
            False,
        )
    return frame

def predict_image(
    model: ultralytics.engine.model.Model,
    input_image_path: str,
    output_image_path: str=None,
    conf: float=0.25,
    iou: float=0.7,
    device: str="cpu",
) -> List[int]:
    input_image = cv2.imread(input_image_path)
    # Make prediction
    result = model.predict(input_image, conf=conf, iou=iou, verbose=False, device=device)[0]
    cls_ids = [set() for _ in range(NUM_CLASSES)]
    for id, cls in enumerate(result.boxes.cls):
        cls_ids[int(cls)].add(int(id))
    # Draw output image
    if output_image_path is not None:
        output_image = draw_frame(result, cls_ids)
        cv2.imwrite(output_image_path, output_image)
    
    answer = [len(cls_ids[i]) for i in range(NUM_CLASSES)]
    return answer

def predict_video(
    model: ultralytics.engine.model.Model,
    input_video_path: str,
    output_video_path: str=None,
    conf: float=0.25,
    iou: float=0.7,
    min_obj_duration: int=3,
    device: str="cpu",
) -> dict:
    input_video = cv2.VideoCapture(input_video_path)
    if output_video_path is not None:
        output_video = get_video_writer(output_video_path, input_video)

    cls_ids = [set() for _ in range(NUM_CLASSES)]
    objects = {}
    frame_number = -1
    while True:
        # Read frame
        ret, frame = input_video.read()
        frame_number += 1
        if not ret:
            break
        
        # Predict on frame
        result = model.track(frame, conf=conf, iou=iou, persist=True, verbose=False, device=device)[0]

        # Update object counts
        for id, cls in zip(result.boxes.id, result.boxes.cls):
            cls_ids[int(cls)].add(int(id))
            if int(id) not in objects:
                objects[int(id)] = {
                    "class": int(cls),
                    "start": frame_number,
                    "end": frame_number,
                }
            else:
                objects[int(id)]["end"] = frame_number

        # Draw output frame
        if output_video_path is not None:
            output_video.write(draw_frame(result, cls_ids))
    
    # Close output video writer
    if output_video_path is not None:
        output_video.release()
    
    answer = {
        "video": [0] * NUM_CLASSES,
        "frames": [[0] * NUM_CLASSES for _ in range(frame_number)],
    }
    for obj in objects.values():
        # Skip objects that were not detected enough time
        if (obj["end"] - obj["start"] + 1) < min_obj_duration:
            continue
        
        answer["video"][obj["class"]] += 1
        for i in range(obj["start"], obj["end"]+1):
            answer["frames"][i][obj["class"]] += 1

    return answer