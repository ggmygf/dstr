import torch
import gradio as gr
import os
from PIL import Image
from diffusers import QwenImageEditPlusPipeline
from pathlib import Path

# Create a folder for the result.jpg
RESULT_DIR = Path("./static")
RESULT_DIR.mkdir(exist_ok=True)

# Load model onto H100
pipe = QwenImageEditPlusPipeline.from_pretrained(
    "Qwen/Qwen-Image-Edit-2509", 
    torch_dtype=torch.bfloat16
).to("cuda")

def process_edit(target_img, ref_img, prompt):
    if target_img is None or ref_img is None:
        return None
    
    # Force both slots to be the same size to prevent 'Tensor Mismatch'
    t_img = target_img.convert("RGB").resize((1024, 1024))
    r_img = ref_img.convert("RGB").resize((1024, 1024))

    print("--- STARTING CALCULATION (H100 STABILITY MODE) ---")
    
    # H100 FIX: This context manager stops the 'scaled_dot_product_attention' crash
    # It forces the GPU to use the stable C++ path instead of the broken kernel
    with torch.backends.cuda.sdp_kernel(enable_flash=False, enable_math=True, enable_mem_efficient=False):
        with torch.inference_mode():
            output = pipe(
                image=[t_img, r_img],
                prompt=prompt,
                negative_prompt=" ", 
                num_inference_steps=40,
                true_cfg_scale=4.0,
                height=1024,
                width=1024,
            ).images[0]
    
    # Save for direct URL access
    save_path = RESULT_DIR / "result.jpg"
    output.save(save_path, "JPEG")
    
    print(f"--- SUCCESS! SAVED TO {save_path} ---")
    return output

with gr.Blocks(title="Qwen H100 Fixed") as demo:
    gr.Markdown("# Qwen Image Edit - H100 Pro Fix")
    with gr.Row():
        with gr.Column():
            slot1 = gr.Image(label="SLOT 1: TARGET", type="pil")
            slot2 = gr.Image(label="SLOT 2: REF (Put same as 1 for face lock)", type="pil")
            prompt = gr.Textbox(label="Instruction", value="Make the person in image 1 look like image 2")
            btn = gr.Button("RUN")
        with gr.Column():
            out = gr.Image(label="RESULT")
            # This is your direct URL link
            gr.Markdown("Direct Link: [result.jpg](/file=static/result.jpg)")

    btn.click(fn=process_edit, inputs=[slot1, slot2, prompt], outputs=out)

# allowed_paths is required to serve the result.jpg
demo.launch(server_name="0.0.0.0", server_port=8000, debug=True, allowed_paths=["./static"])
