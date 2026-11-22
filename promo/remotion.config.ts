import {Config} from '@remotion/cli/config';

// Use the system's pre-installed headless Chromium instead of downloading one.
// Remove this line on a machine where Remotion can fetch its own browser.
Config.setBrowserExecutable(process.env.REMOTION_BROWSER ?? '/opt/pw-browsers/chromium_headless_shell');
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setPixelFormat('yuv420p');
