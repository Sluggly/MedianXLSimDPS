import os

def consolidate_folder_contents(folder_paths, output_file_path):
    """
    Traverses multiple folders and their subfolders, reading the content of readable files
    and writing it to a single output file, excluding specified subdirectories.

    Args:
        folder_paths (list): List of folder paths to be processed.
        output_file_path (str): The path to the text file where results will be saved.
    """
    try:
        with open(output_file_path, 'w', encoding='utf-8', errors='ignore') as output_file:
            print(f"Output will be saved to: {output_file_path}")

            for folder_path in folder_paths:
                if not os.path.isdir(folder_path):
                    print(f"Warning: The folder '{folder_path}' does not exist. Skipping.")
                    continue

                print(f"Processing folder: {folder_path}")
                for dirpath, dirnames, filenames in os.walk(folder_path):
                    # Modify dirnames in-place to skip unwanted directories
                    dirnames[:] = [d for d in dirnames if d not in EXCLUDED_DIRS]

                    for filename in filenames:
                        _, extension = os.path.splitext(filename)
                        if extension.lower() in READABLE_EXTENSIONS:
                            file_path = os.path.join(dirpath, filename)
                            try:
                                header = f"--- File: {file_path} ---\n"
                                print(f"  -> Reading: {file_path}")
                                output_file.write(header)

                                with open(file_path, 'r', encoding='utf-8', errors='ignore') as input_file:
                                    content = input_file.read()
                                    output_file.write(content)
                                
                                output_file.write("\n\n")
                            except Exception as e:
                                error_message = f"--- Could not read file: {file_path} (Error: {e}) ---\n\n"
                                print(f"  -> Error reading {file_path}: {e}")
                                output_file.write(error_message)
            print("Consolidation complete!")

    except IOError as e:
        print(f"Error: Could not write to the output file '{output_file_path}'. Check permissions.")
        print(e)
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

# A set of common text-based file extensions.
READABLE_EXTENSIONS = {
    '.txt', '.py', '.java', '.json', '.xml', '.html', '.css', '.js',
    '.md', '.gradle', '.properties', '.cfg', '.toml', '.log', '.sh', '.bat',
    '.c', '.cpp', '.h', '.cs', '.go', '.rb', '.php', '.sql'
}

EXCLUDED_DIRS = {'script'}

if __name__ == "__main__":
    # Modify these folder paths as needed
    input_folders_forge = [
        "D:\Projets\Diablo\MedianXLSimDPS"
    ]
    output_filename_forge = "allProjectPrompt.txt"

    consolidate_folder_contents(input_folders_forge, output_filename_forge)